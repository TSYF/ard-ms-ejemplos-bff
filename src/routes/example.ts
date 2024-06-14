import { envs } from '@/config/env';
import { ErrorBody } from '@/types/ErrorBody';
import { CommonResponseBody } from '@/types/CommonResponseBody';
import express from 'express';
import { matches } from '@/utils';
import { Example, exampleMatcher } from '../types/Example';
import { RequestBody } from '../utils';
const router = express.Router();

const { EXAMPLE_ENDPOINT } = envs;

//* Index
router.get(
    "/",
    (req, res) => {
        /* #swagger.responses[200] = {
            content: {
                  "application/json": {
                    ok: true,
                    code: 200,
                    data: [
                        {
                            
                        },
                        {
                            
                        }
                    ]
                }
            }
          }
        */
        /* #swagger.responses[500] = {
            content: {
                "application/json": {
                    ok: false,
                    code: 500,
                    data: {
                        message: "¡Ha ocurrido un problema inesperado!"
                    } 
                }
            }
          }
        */
        fetch(EXAMPLE_ENDPOINT)
            .then(response => response.json())
            .then(examples => {
                if (Array.isArray(examples)) {
                    const CODE = 200;
                    const response = new CommonResponseBody(
                        true,
                        CODE,
                        examples
                    )
                    res.status(CODE).send(response);
                } else {
                    const CODE = 500;
                    const error: ErrorBody = {
                        private: "La lista de ejemplos no pasa el typecheck de array en Index",
                        public: new CommonResponseBody(
                            false,
                            CODE,
                            {
                                message: "¡Ha ocurrido un problema inesperado!"
                            }
                        )
                    }
                    console.log(error.private);
                    res.status(CODE).send(error.public);
                }
            }).catch(err => {
                const CODE = 500;
                const error: ErrorBody = {
                    private: "Error inesperado en llamado fetch en Index",
                    public: new CommonResponseBody(
                        false,
                        CODE,
                        {
                            message: "¡Ha ocurrido un problema inesperado!"
                        }
                    ),
                    errorObject: err
                }
                console.log(error.private);
                console.error(error.errorObject)
                res.status(CODE).send(error.public);
            })
    }
);

//* Show
router.get(
    "/:id",
    (req, res) => {
        /* #swagger.responses[200] = {
                content: {
                    "application/json": {
                        ok: false,
                        code: 200,
                        data: {
                            
                        }
                    }
                }
            }
        */
        /* #swagger.responses[500] = {
            content: {
                "application/json": {
                    ok: false,
                    code: 500,
                    data: {
                        message: "¡Ha ocurrido un problema inesperado!"
                    } 
                }
            }
          }
        */
        fetch(
            `${EXAMPLE_ENDPOINT}${req.params.id}/`
        ).then(response => response.json())
        .then(example => {
                    const CODE = 200;
                    const response = new CommonResponseBody(
                        true,
                        CODE,
                        example
                    )
                    res.status(CODE).send(response);
        }).catch(err => {
            const CODE = 500;
    
            const error: ErrorBody = {
                private: "Error inesperado en llamado fetch en Show",
                public: new CommonResponseBody(
                    false,
                    CODE,
                    {
                        message: "¡Ha ocurrido un problema inesperado!"
                    }
                ),
                errorObject: err
            }
            console.log(error.private);
            console.error(error.errorObject)
            res.status(CODE).send(error.public);
        })
    }
);

//* ShowList
router.get(
    "/list/:ids",
    (req, res) => {
        /* #swagger.responses[200] = {
            content: {
                  "application/json": {
                    ok: true,
                    code: 200,
                    data: [
                        {
                            
                        },
                        {
                            
                        }
                    ]
                }
            }
          }
        */
        /* #swagger.responses[500] = {
            content: {
                "application/json": {
                    ok: false,
                    code: 500,
                    data: {
                        message: "¡Ha ocurrido un problema inesperado!"
                    } 
                }
            }
          }
        */
        fetch(
            `${EXAMPLE_ENDPOINT}list/${req.params.ids}/`
        ).then(response => response.json())
        .then(examples => {
                res.status(200).send(examples);
        }).catch(err => {
            const CODE = 500;
    
            const error: ErrorBody = {
                private: "Error inesperado en llamado fetch en ShowList",
                public: new CommonResponseBody(
                    false,
                    CODE,
                    {
                        message: "¡Ha ocurrido un problema inesperado!"
                    }
                ),
                errorObject: err
            }
            console.log(error.private);
            console.error(error.errorObject)
            res.status(CODE).send(error.public);
        })
    }
);

//* Store
router.post(
    "/",
    (req, res) => {
        /* #swagger.responses[201] = {
                content: {
                    "application/json": {
                        ok: false,
                        code: 201,
                        data: {
                            
                        }
                    }
                }
            }
        */
        /* #swagger.responses[422] = {
            content: {
                "application/json": {
                    ok: false,
                    code: 422,
                    data: {
                        message: "La forma del cuerpo no coincide con la forma de Ejemplo"
                    } 
                }
            }
          }
        */
        /* #swagger.responses[500] = {
            content: {
                "application/json": {
                    ok: false,
                    code: 500,
                    data: {
                        message: "¡Ha ocurrido un problema inesperado!"
                    } 
                }
            }
          }
        */
        const example: Example & RequestBody = req.body;

        if (!matches(example, exampleMatcher) || example.image.trim() === "") {
            const CODE = 422;
            
            const error: ErrorBody = {
                private: "La forma del cuerpo no coincide con la forma de Ejemplo",
                public: new CommonResponseBody(
                    false,
                    CODE,
                    {
                        message: "La forma del cuerpo no coincide con la forma de Ejemplo"
                    }
                )
            }
            console.log(error.private);
            console.error(error.errorObject)
            res.status(CODE).send(error.public);
            return;
        }
        
        fetch(
            EXAMPLE_ENDPOINT,
            {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(example)
            }
        ).then(response => (console.log(response), response.json()))
        .then(example => {
            if (matches(example, exampleMatcher)) {
                const response = new CommonResponseBody(
                    true,
                    201,
                    example
                )
                res.status(201).send(response);
            } else {
                const CODE = 500;
                const error: ErrorBody = {
                    private: "El ejemplo retornado no pasa el typecheck en Store",
                    public: new CommonResponseBody(
                        false,
                        CODE,
                        {
                            message: "¡Ha ocurrido un problema inesperado!"
                        }
                    )
                }
                console.log(example);
                console.log(error.private);
                res.status(CODE).send(error.public);
            }
        }).catch(err => {
            const CODE = 500;

            const error: ErrorBody = {
                private: "Error inesperado en llamado fetch en Store",
                public: new CommonResponseBody(
                    false,
                    CODE,
                    {
                        message: "¡Ha ocurrido un problema inesperado!"
                    }
                ),
                errorObject: err
            }
            console.log(error.private);
            console.error(error.errorObject)
            res.status(CODE).send(error.public);
        })
    }
)

//* Update
router.put(
    "/:id",
    (req, res) => {
        /* #swagger.responses[200] = {
                content: {
                    "application/json": {
                        ok: false,
                        code: 200,
                        data: {
                            
                        }
                    }
                }
            }
        */
        /* #swagger.responses[500] = {
            content: {
                "application/json": {
                    ok: false,
                    code: 500,
                    data: {
                        message: "¡Ha ocurrido un problema inesperado!"
                    } 
                }
            }
          }
        */
        fetch(
            `${EXAMPLE_ENDPOINT}${req.params.id}/`,
            {
                method: "PUT",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(req.body)
            }
        ).then(response => response.json())
        .then(example => {
                    const CODE = 200;
                    const response = new CommonResponseBody(
                        true,
                        CODE,
                        example
                    )
                    res.status(CODE).send(response);
        }).catch(err => {
            const CODE = 500;
    
            const error: ErrorBody = {
                private: "Error inesperado en llamado fetch en Update",
                public: new CommonResponseBody(
                    false,
                    CODE,
                    {
                        message: "¡Ha ocurrido un problema inesperado!"
                    }
                ),
                errorObject: err
            }
            console.log(error.private);
            console.error(error.errorObject)
            res.status(CODE).send(error.public);
        })
    }
)

//* Delete
router.delete(
    "/:id",
    (req, res) => {
        /* #swagger.responses[200] = {
                content: {
                    "application/json": {
                        ok: false,
                        code: 200,
                        data: {
                            
                        }
                    }
                }
            }
        */
        /* #swagger.responses[500] = {
            content: {
                "application/json": {
                    ok: false,
                    code: 500,
                    data: {
                        message: "¡Ha ocurrido un problema inesperado!"
                    } 
                }
            }
          }
        */
        const example: RequestBody = req.body;
        if (example.hasOwnProperty("image") && example.image.trim() === "") {
            const CODE = 422;
            
            const error: ErrorBody = {
                private: "La forma del cuerpo no coincide con la forma de Ejemplo",
                public: new CommonResponseBody(
                    false,
                    CODE,
                    {
                        message: "La forma del cuerpo no coincide con la forma de Ejemplo"
                    }
                )
            }
            console.log(error.private);
            console.error(error.errorObject)
            res.status(CODE).send(error.public);
            return;
        }
       
        fetch(
            `${EXAMPLE_ENDPOINT}${req.params.id}/`,
            {
                method: "DELETE"
            }
        ).then(response => response.json())
        .then(example => {
                    const CODE = 200;
                    const response = new CommonResponseBody(
                        true,
                        CODE,
                        example
                    )
                    res.status(CODE).send(response);
        }).catch(err => {
            const CODE = 500;
    
            const error: ErrorBody = {
                private: "Error inesperado en llamado fetch en Delete",
                public: new CommonResponseBody(
                    false,
                    CODE,
                    {
                        message: "¡Ha ocurrido un problema inesperado!"
                    }
                ),
                errorObject: err
            }
            console.log(error.private);
            console.error(error.errorObject)
            res.status(CODE).send(error.public);
        })
    }
)

export default router;