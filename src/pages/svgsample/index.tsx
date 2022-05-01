import { collection, doc, Firestore, onSnapshot, setDoc, Unsubscribe } from 'firebase/firestore'
import React, { useEffect, useRef, useState } from 'react'
import uuid from 'react-uuid'
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
  id: string | null
  points: PointerType[]
  color: string
}

const Home = () => {
  const [elements, setElements] = useState<DrawElementType[]>([])
  //   const [newElement, setNewElement] = useState<DrawElementType>(null)
  // Our custom hook to get context values
  const { isLoading, user } = useUser()
  const svgElementRef = useRef<SVGSVGElement>(null)
  const canvasElementRef = useRef<HTMLCanvasElement>(null)
  const [dragMoveHandler, setDragMoveHandler] = useState<HandlerType | null>(null)
  const [dragEndHandler, setDragEndHandler] = useState<HandlerType | null>(null)
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

  //   useEffect(() => {
  //     const canvas = new fabric.Canvas(canvasElementRef.current, {
  //       isDrawingMode: true, // 手書きモード
  //       width: 800,
  //       height: 300,
  //       // backgroundColor: '#80beaf',
  //       // backgroundImage:
  //     })

  //     canvas.setBackgroundImage(
  //       'https://api.mediacms.jp/uploads/medium_20210118_ktgwyzr_2542364bcd.jpg',
  //       canvas.renderAll.bind(canvas),
  //     )
  //   }, [])

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

  const dragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    const newElement: DrawElementType = { id: null, points: [], color: 'red' }
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
          //   console.log(e.nativeEvent.clientX, e.nativeEvent.clientY)
          currentPointer = {
            x: event.nativeEvent.clientX - rect.x,
            y: event.nativeEvent.clientY - rect.y,
          }
        }
        updateElements(currentPointer)
        // console.log('beforeUpdateNewElements', JSON.stringify(elements))
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
      const currentProcessElement = beforeElements.pop()
      currentProcessElement.points = [...currentProcessElement.points, pointer]
      const newElements = [...beforeElements, currentProcessElement]
      return newElements
    })
  }

  const createDoc = async () => {
    // try {
    await setDoc(doc(db, 'temps', 'element'), { elements: 'element' })
    console.log('create doc')
    // } catch (e) {
    //   console.log(e)
    // }
  }
  return (
    <div>
      <main className='container'>
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
              key={uuid()}
              fill='none'
              stroke={element.color}
              strokeLinecap='round'
              strokeWidth='5'
              points={pointsAttr(element.points)}
            />
          ))}
        </svg>
      </main>
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
