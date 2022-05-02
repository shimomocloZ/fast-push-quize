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
  const { roomId } = router.query
  const [elements, setElements] = useState<DrawElementType[]>([])
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
    onSnapshot(tempDoc, (snapshot) => {
      const serverElements: DrawElementType[] = []
      snapshot.docChanges().forEach((changes) => {
        if (changes.type === 'added') {
          const element = changes.doc.data() as DrawElementType
          serverElements.push(element)
        }
      })
      setElements([...elements, ...serverElements])
    })
  }, [])

  const dragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    const newElement: DrawElementType = { id: uuid(), points: [], color: 'red' }
    setElements([...elements, newElement])
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
        updateElements(currentPointer)
      },
    })
    setDragEndHandler({
      handler: async () => {
        if (newElement.points.length === 0) return
        await addDoc(collection(db, `temps/${roomId}/elements`), newElement)
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

  const updateElements = (pointer: PointerType): void => {
    setElements((elements) => {
      const beforeElements = [...elements]
      const processNewElement = beforeElements.pop()
      processNewElement.points = [...processNewElement.points, pointer]
      const newElements = [...beforeElements, processNewElement]
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
          {elements.map((element) => (
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
