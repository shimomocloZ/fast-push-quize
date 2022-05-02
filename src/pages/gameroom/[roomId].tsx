import { addDoc, collection, onSnapshot, query } from 'firebase/firestore'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import uuid from 'react-uuid'
import { Container } from 'reactstrap'
import { useUser } from '../../context/userContext'
import { db } from '../../firebase/clientApp'

type HandlerType = {
  handler: (event: React.MouseEvent | React.TouchEvent) => void
}

type PointerType = {
  x: number
  y: number
}

type DrawElementType = {
  id: string
  points: PointerType[]
  color: string
}

const Home = () => {
  const router = useRouter()
  const { roomId, permission } = router.query
  const [drawerElements, setDrawerElements] = useState<DrawElementType[]>([])
  const { isLoading, user } = useUser()
  const svgElementRef = useRef<SVGSVGElement>(null)
  const [dragMoveHandler, setDragMoveHandler] = useState<HandlerType | null>(null)
  const [dragEndHandler, setDragEndHandler] = useState<HandlerType | null>(null)

  useEffect(() => {
    if (!isLoading) {
      // You know that the user is loaded: either logged in or out!
      // console.log(user)
    }
    // You also have your firebase app initialized
  }, [isLoading, user])

  useEffect(() => {
    const tempDoc = query(collection(db, `temps/${roomId}/elements`))
    const unsubscribe = onSnapshot(tempDoc, (snapshot) => {
      snapshot.docChanges().forEach((changes) => {
        const element = changes.doc.data() as DrawElementType
        element.id = changes.doc.id
        setDrawerElements((viewerElements) => {
          return [...viewerElements, element]
        })
      })
    })
    return () => unsubscribe()
  }, [])

  const dragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    const newElement: DrawElementType = { id: uuid(), points: [], color: 'red' }
    setDrawerElements([...drawerElements, newElement])
    const rect = svgElementRef.current.getBoundingClientRect()
    setDragMoveHandler({
      handler: (event: React.MouseEvent | React.TouchEvent) => {
        let currentPointer: PointerType
        if (event.nativeEvent instanceof TouchEvent) {
          currentPointer = {
            x: event.nativeEvent.touches[0].clientX - rect.x,
            y: event.nativeEvent.touches[0].clientY - rect.y,
          }
        } else if (event.nativeEvent instanceof MouseEvent) {
          currentPointer = {
            x: event.nativeEvent.clientX - rect.x,
            y: event.nativeEvent.clientY - rect.y,
          }
        }
        updateElementPoints(currentPointer)
      },
    })
    setDragEndHandler({
      handler: () => {
        if (newElement.points.length === 0) return
        addDoc(collection(db, `temps/${roomId}/elements`), newElement)
      },
    })
    // if (this.selectedMode === "drawLine") {
    // } else if (this.selectedMode === "erase") {
    //   this.dragMoveHandler = () => {
    //     const target = event.touches
    //       ? document.elementFromPoint(
    //           event.touches[0].clientX,
    //           event.touches[0].clientY
    //         )
    //       : event.target;
    //     if (target.tagName === "polyline") {
    //       const elementId = target.getAttribute("element-id");
    //       this.elementsCollectionRef.doc(elementId).delete();
    //     }
    //   };
    // }
  }
  const dragMove = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    if (dragMoveHandler) {
      dragMoveHandler.handler(e)
    }
  }
  const dragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    if (dragEndHandler) {
      dragEndHandler.handler(e)
    }
    setDragMoveHandler(null)
    setDragEndHandler(null)
  }

  const pointsAttr = (points: PointerType[]) => {
    let attr = ''
    for (let point of points) {
      attr += `${point.x},${point.y} `
    }
    return attr
  }

  const updateElementPoints = (pointer: PointerType): void => {
    setDrawerElements((elements) => {
      const beforeElements = [...elements]
      const currentProcessElement = beforeElements.pop()
      currentProcessElement.points = [...currentProcessElement.points, pointer]
      const newElements = [...beforeElements, currentProcessElement]
      return newElements
    })
  }
  return (
    <div>
      <Container>
        <svg
          ref={svgElementRef}
          className='canvas'
          version='1.1'
          xmlns='http://www.w3.org/2000/svg'
          height={500}
          width={1500}
          onMouseDown={dragStart}
          onMouseMove={dragMove}
          onMouseUp={dragEnd}
          onTouchStart={dragStart}
          onTouchMove={dragMove}
          onTouchEnd={dragEnd}
        >
          {drawerElements.map((element) => (
            <polyline
              key={element.id}
              element-id={element.id}
              fill='none'
              stroke={element.color}
              strokeLinecap='round'
              strokeWidth='5'
              points={pointsAttr(element.points)}
            />
          ))}
        </svg>

        {/* {permission === 'general' && (
          <svg
            ref={svgElementRef}
            className='canvas'
            version='1.1'
            xmlns='http://www.w3.org/2000/svg'
            height={500}
            width={1500}
          >
            {viewerElements.map((element) => (
              <polyline
                key={element.id}
                element-id={element.id}
                fill='none'
                stroke={element.color}
                strokeLinecap='round'
                strokeWidth='5'
                points={pointsAttr(element.points)}
              />
            ))}
          </svg>
        )} */}
      </Container>
      <style jsx>
        {`
          .canvas {
            border: solid ipx;
            background-image: url(https://api.mediacms.jp/uploads/medium_20210118_ktgwyzr_2542364bcd.jpg);
            background-repeat: no-repeat;
            background-size: contain; /* 画像のサイズを指定    */
            width: 100%; /* 横幅のサイズを指定    */
          }
        `}
      </style>
    </div>
  )
}

export default Home
