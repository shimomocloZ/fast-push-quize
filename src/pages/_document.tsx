import Document, { Head, Html, Main, NextScript } from 'next/document'
import { ServerStyleSheet as StyledComponentSheets } from 'styled-components'

type Props = {
  styleTags: any
}

export default class MyDocument extends Document<Props> {
  static getInitialProps({ renderPage }) {
    const styledComponentSheets = new StyledComponentSheets()
    const page = renderPage((App) => (props) => styledComponentSheets.collectStyles(<App {...props} />))

    const styleTags = styledComponentSheets.getStyleElement()

    return { ...page, styleTags }
  }

  render() {
    return (
      <Html lang='ja'>
        <Head>
          <meta charSet='utf-8' />
          {this.props.styleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
