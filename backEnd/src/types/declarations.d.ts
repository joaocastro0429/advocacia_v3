declare module 'cors' {
  import type { RequestHandler } from 'express'

  type CorsOptions = {
    origin?: string | RegExp | Array<string | RegExp> | boolean | ((origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => void)
    credentials?: boolean
    methods?: string | string[]
    allowedHeaders?: string | string[]
    exposedHeaders?: string | string[]
    maxAge?: number
    preflightContinue?: boolean
    optionsSuccessStatus?: number
  }

  function cors(options?: CorsOptions): RequestHandler
  export default cors
}

declare module 'swagger-ui-express' {
  import type { RequestHandler } from 'express'

  export const serve: RequestHandler
  export function setup(swaggerDoc: any, options?: any): RequestHandler

  const swaggerUi: {
    serve: RequestHandler
    setup: typeof setup
  }

  export default swaggerUi
}
