import { addDoc, collection, doc, Firestore, onSnapshot, setDoc, Unsubscribe } from 'firebase/firestore'
import React, { useEffect, useRef, useState } from 'react'
import { useUser } from '../context/userContext'
import { db } from '../firebase/clientApp'

type HandlerType = {
  handler: () => void
}

type PointerType = {
  x: number
  y: number
}

type DrawElementType = {
  id: string | null
  points: PointerType[]
  color: string
}

const Home = () => {
  const [elements, setElements] = useState<DrawElementType[]>([])
  // Our custom hook to get context values
  const { isLoading, user } = useUser()
  const svgElementRef = useRef<SVGSVGElement>(null)
  const canvasElementRef = useRef<HTMLCanvasElement>(null)
  const [dragMoveHandler, setDragMoveHandler] = useState<HandlerType | null>(null)
  const [dragEndHandler, setDragEndHandler] = useState<HandlerType | null>(null)
  const [clientX, setClientX] = useState<number>(null)
  const [clientY, setClientY] = useState<number>(null)
  // let clientX = 0
  // let clientY = 0
  const [elementsCollectionRef, setElementsCollectionRef] = useState<Firestore>(null)

  const profile = {
    username: 'shimomoclo.sys@gmail.com',
    message: 'Awesome!!',
  }

  useEffect(() => {
    if (!isLoading) {
      // You know that the user is loaded: either logged in or out!
      console.log(user)
    }
    // You also have your firebase app initialized
  }, [isLoading, user])

  useEffect(() => {
    console.log('snapshot use effect')
    const fn: Unsubscribe = () => {
      return () => {
        const tempDoc = doc(collection(db, 'temps'), 'elements')
        onSnapshot(tempDoc, (snapshot) => {
          console.log(snapshot.data())
        })
      }
    }
    fn()
  }, [])

  const dragStart = (e: React.MouseEvent<HTMLOrSVGElement> | React.TouchEvent<HTMLOrSVGElement>) => {
    e.preventDefault()
    // e.persist()
    // console.log('aaaa')
    const newElement: DrawElementType = { id: null, points: [], color: 'red' }
    const newElements = elements.concat(newElement)
    setElements(newElements)
    const rect = svgElementRef.current.getBoundingClientRect()
    setClientX(rect.x)
    setClientY(rect.y)
    setDragMoveHandler({
      handler: () => {
        // console.log(e)
        if (e.nativeEvent instanceof TouchEvent) {
          setClientX(e.nativeEvent.touches[0].clientX)
          setClientY(e.nativeEvent.touches[0].clientY)
        } else if (e.nativeEvent instanceof MouseEvent) {
          setClientX(e.nativeEvent.clientX)
          setClientY(e.nativeEvent.clientY)
        }
        console.log(clientX, rect.x, clientY, rect.y)
        console.log(clientX - rect.x, clientY - rect.y)
        newElement.points.push({
          x: clientX - rect.x,
          y: clientY - rect.y,
        })
        // console.log(newElement.points)
      },
    })
    setDragEndHandler({
      handler: () => {
        if (newElement.points.length === 0) return
        // this.elementsCollectionRef.add(newElement);
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
    // console.log('drag on...')
    e.preventDefault()
    if (dragMoveHandler) {
      // console.log('move handler')
      dragMoveHandler.handler()
    }
  }
  const dragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    // console.log('drag end...')
    if (dragEndHandler) {
      // console.log('end handler')
      dragEndHandler.handler()
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

  const createDoc = async () => {
    // try {
    await setDoc(doc(db, 'temps', 'element'), { elements: 'element' })
    console.log('create doc')
    // } catch (e) {
    //   console.log(e)
    // }
  }

  const createUser = async () => {
    await addDoc(collection(db, 'profile'), profile)

    alert('User created!!')
  }

  return (
    <div>
      <main>
        <button onClick={createDoc}>ドキュメント作成</button>
        <canvas ref={canvasElementRef}></canvas>
        {/* <svg
          ref={svgElementRef}
          className='canvas'
          version='1.1'
          xmlns='http://www.w3.org/2000/svg'
          onMouseDown={dragStart}
          onMouseMove={dragMove}
          onMouseUp={dragEnd}
          onTouchStart={dragStart}
          onTouchMove={dragMove}
          onTouchEnd={dragEnd}
        >
          {elements.map((element) => (
            <polyline
              key={uuid()}
              fill='none'
              stroke={element.color}
              strokeLinecap='round'
              strokeWidth='5'
              points={pointsAttr(element.points)}
            />
          ))}
        </svg> */}
      </main>

      <style jsx>{`
        .canvas {
          border: solid 1px;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans,
            Droid Sans, Helvetica Neue, sans-serif;
        }

        * {
          box-sizing: border-box;
        }
        div {
          padding: 0;
          margin: 0;
        }
      `}</style>
    </div>
  )
}

export default Home
