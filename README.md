# Teste ténico DevOz OzMap

## Informações

- **Nome completo:** Luan Victor de Araujo Silva
- **Linkedin:** https://www.linkedin.com/in/luanvictor-/
- **Github:** https://github.com/LuanVictr
- **Telefone:** [(88)998605296](https://wa.me/+5599998605296)
- **Email:** [luanvictordev@gmail.com](mailto:luanvictordev@gmail.com)

## Como iniciar o projeto

Para executar o projeto, clone o repositório.

Renomeie o arquivo [.env.example](./app_api/.env.example) para .env

Execute o comando:

```bash
docker compose up
```

*O projeto possue um .env exposto por motivos de ser somente um teste.*

Após isso serão criados os conteiners: app_api, db.


## Documentação da API

Esta é a documentação da API que descreve os endpoints disponíveis, os métodos aceitos, os parâmetros necessários e as respostas esperadas. A API permite a manipulação de usuários e regiões.

## Base URL

```
http://localhost:3003/
```

## Endpoints

Todas as rotas estão disponíveis no arquivo [routes.json](./app_api/routes.json), importe o arquivo no seu cliente de requisições preferido. Ex: Insomnia, Postman

### Usuários

#### 1. Criar um novo usuário

- **Endpoint:** `/user`
- **Método HTTP:** POST
- **Parâmetros:**
  - `name` (string, obrigatório): Nome do usuário.
  - `email` (string, obrigatório): Email do usuário.
  - `address` (string, opcional): Endereço do usuário.
  - `coordinates` (coordinates, opcional): Coordenadas do usuário.

*Atenção deve ser fornecido as coordenadas **ou** o endereço. Prover as duas informações retornará um erro.

- **Resposta de sucesso:**
  - Código: 201
  - Corpo:
  ```json
    {
      "createdUser": {
          "message": "User created successfully",
          "user": {
              "name": "Nome do usuário",
              "email": "Email do usuário",
              "coordinates": [
                  -22.9068467,
                  -43.1728965
              ],
              "regions": [],
               "_id": "665392258cdffe4df8cb17d2",
              "createdAt": "2024-05-26T19:48:53.856Z",
              "updatedAt": "2024-05-26T19:48:53.856Z",
              "address": "Av. Alm. Barroso, 472 - Centro, Rio de Janeiro - RJ, 20031-002, Brazil",
              "__v": 0
          }
      }
    }
  ```

- **Possíveis erros:**


  - Código: 422
  - Corpo:
  ```json
    {
      "message": "\"name\" é obrigatório"
    }
  ```

  - Código: 422
  - Corpo:
  ```json
    {
      "message": "\"email\" é obrigatório"
    }
  ```

  - Código: 500
  - Corpo:
  ```json
    {
      "message": "Please insert only coordinates OR only address"
    }
  ```

#### 2. Obter informações de um usuário

- **Endpoint:** `/user/:id`
- **Método HTTP:** GET
- **Parâmetros:**
  - `id` (string, obrigatório): ID do usuário.
- **Resposta de sucesso:**
  - Código: 200
  - Corpo:
  ```json
    {
      "_id": "ID do usuário",
      "name": "Nome do usuário",
      "email": "Email do usuário",
      "address": "Av. Alm. Barroso, 472 - Centro, Rio de Janeiro - RJ, 20031-002, Brazil",
      "coordinates": [
        -22.9068467,
        -43.1728965
      ],
      "regions": [
        "665235f5ccd7699827ea10da"
      ],
      "createdAt": "2024-05-24T20:06:22.142Z",
      "updatedAt": "2024-05-25T19:03:17.460Z"
    }
  ```
- **Possíveis erros:**
  
  Se o usuário não for encontrado.

  - Código: 404
  - Corpo:
  ```json
    {
      "message": "Usuário não encontrado"
    }
  ```

#### 3. Atualizar informações de um usuário

- **Endpoint:** `/user/:id`
- **Método HTTP:** PUT
- **Parâmetros:**
  - `id` (string, obrigatório): ID do usuário.
  - `name` (string, opcional): Novo nome do usuário.
  - `email` (string, opcional): Novo email do usuário.
  - `address` (string, opcional): Novo endereço do usuário.
  - `coordinates` (coordinates, opcional): Coordenadas do usuário.
  
*Atenção deve ser fornecido as coordenadas **ou** o endereço. Prover as duas informações retornará um erro.

- **Resposta de sucesso:**
  - Código: 201
  - Corpo:
  ```json
    {
      "updatedUser": {
		"_id": "6650f33ed3025c9a97c4b3f3",
		"name": "admin",
		"email": "admin@admin.com",
		"coordinates": [
			-22.9068467,
			-43.1728965
		],
		"regions": [
			"6650f353d3025c9a97c4b3f8",
			"6650f3bed3025c9a97c4b3fe"
		],
		"createdAt": "2024-05-24T20:06:22.142Z",
		"updatedAt": "2024-05-26T19:59:39.463Z",
		"address": "Av. Alm. Barroso, 472 - Centro, Rio de Janeiro - RJ, 20031-002, Brazil",
		"__v": 6
	}
    }
  ```

- **Possíveis erros:**

  Caso o usuário não seja encontrado.

  - Código: 404
  - Corpo:
  ```json
    {
      "message": "Usuário não encontrado"
    }
  ```

  Caso sejam fornecidas coordenadas e endereço.

  - Código: 400
  - Corpo:
  ```json
    {
     "message": "Please insert only coordinates OR only address"
    }
  ```

  Caso a requisição não possua um corpo.

  - Código: 400
  - Corpo:
  ```json
    {
     "message": "To update a user you need to provide a body"
    }
  ```

#### 4. Deletar um usuário

- **Endpoint:** `/user/:id`
- **Método HTTP:** DELETE
- **Parâmetros:**
  - `id` (string, obrigatório): ID do usuário.
- **Resposta de sucesso:**
  - Código: 200
  - Corpo:
  ```json
    {
	  "deleted": {
		  "_id": "66523f4a802d5287c01251c3",
		  "name": "Alan",
		  "email": "Magnolia18@hotmail.com",
		  "address": "18184 Borer Landing Apt. 665",
		  "coordinates": [
		  	-3.3099,
		  	70.5658
		  ],
		  "regions": [
		  	"66523f4a802d5287c01251c5",
		  	"66523f4a802d5287c01251c9",
		  ],
		  "createdAt": "2024-05-25T19:43:06.063Z",
		  "updatedAt": "2024-05-25T19:43:07.575Z",
		  "__v": 9
	    }
    }
  ```

- **Possíveis erros:**
  - Código: 404
  - Corpo:
  ```json
    {
      "message": "Usuário não encontrado"
    }
  ```

### Regiões

**Rotas autenticadas**
  
  Todas as rotas de regiões possuem autenticação via Bearer token. Para autenticar o usuário utilize a rota:

  #### Login de usuário

- **Endpoint:** `/auth`
- **Método HTTP:** POST
- **Parâmetros:**
  - `name` (string, obrigatório): Nome do usuário.
  - `email` (string, obrigatório): Email do usuário.
- **Resposta de sucesso:**
  - Código: 200
  - Corpo:
  ```json
    {
	    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NTBmMzNlZDMwMjVjOWE5N2M0YjNmMyIsImlhdCI6MTcxNjY2NTQ3NCwiZXhwIjoxNzE3MjcwMjc0fQ.wyi02Ah5PI0cXL2Ol_-1aXuWgV4y46D_i8Kt2ezvSRs"
    }
  ```

- **Possíveis erros:**
  - Código: 404
  - Corpo:
  ```json
    {
      "message": "Usuário não encontrado"
    }
  ```


#### 1. Criar uma nova região (Auth)

- **Endpoint:** `/region`
- **Método HTTP:** POST
- **Parâmetros:**
  - `name` (string, obrigatório): Nome da região.
  - `region` (object, obrigatório): Objeto representando a região geográfica
- **Exemplo de corpo de requisição:**

  ```json
  {
    "name": "region 9l",
    "region": {
      "type": "Polygon",
      "coordinates": [
        [
          [-73.98178100585938, 40.768020857734],
          [-73.95832061767578, 40.80090536006155]
        ]
      ]
    }
  }
  ```
- **Resposta de sucesso:**
  - Código: 201
  - Corpo:
  ```json
    {
	  "createdRegion": {
		"message": "Region created successfully",
		"newRegion": {
			"name": "region 9l",
			"region": {
				"type": "Polygon",
				"coordinates": [
        [
          [-73.98178100585938, 40.768020857734],
          [-73.95832061767578, 40.80090536006155],
        ]
      ]
			},
			"user": "665235ecccd7699827ea10d8",
			"createdAt": "2024-05-25T19:27:23.234Z",
			"updatedAt": "2024-05-25T19:27:23.234Z",
			"_id": "66523b9bdb52577f057bf410",
			"__v": 0
		}
	  }
    }
  ```
- **Possíveis erros:**
  
  Erro Genérico

  - Código: 500
  - Corpo:
  ```json
    {
      "message": "Erro ao criar região"
    }
  ```

  Caso o body seja enviado vazio, ele retorna um erro para cada informação obrigatória que não foi provida.

  - Código: 422
  - Corpo:
```json
    {
	  "message": "\"name\" is required"
    }
```

   - Código: 422
  - Corpo:
```json
    {
	  "message": "\"email\" is required"
    }
```

   - Código: 422
   - Corpo:
```json
    {
	  "message": "\"region.coordinates\" is required"
    }
```

#### 2. Obter informações de uma região (Auth)

- **Endpoint:** `/region/:id`
- **Método HTTP:** GET
- **Parâmetros:**
  - `id` (string, obrigatório): ID da região.
- **Resposta de sucesso:**
  - Código: 200
  - Corpo:
  ```json
    {
	  "_id": "66523fb10309f3bcd4daad73",
	  "name": "Fiji",
	  "region": {
		  "type": "Polygon",
		  "coordinates": [
			  [
				  [
					  128.7969,
					  30.8492
				  ],
				  [
					  0.2844,
					  -82.8256
				  ],
				  [
					  114.0085,
					  -59.1305
				  ],
				  [
					  145.208,
					  41.7036
				  ],
				  [
					  -75.8149,
					  -65.776
				  ]
			  ]
		  ]
	  },
	  "user": "66523fb00309f3bcd4daad42",
	  "createdAt": "2024-05-25T19:44:49.538Z",
	  "updatedAt": "2024-05-25T19:44:49.538Z",
	  "__v": 0
    }
  ```

- **Possíveis erros:**
  - Código: 404
  - Corpo:
  ```json
    {
      "message": "Region not found"
    }
  ```

#### 3. Atualizar informações de uma região. (Auth)

- **Endpoint:** `/region/:id`
- **Método HTTP:** PUT
- **Parâmetros:**
  - `id` (string, obrigatório): ID da região.
  - `name` (string, opcional): Novo nome da região.
  - `user` (string, opcional): Novo usuário associado à região. *Caso não seja fornecido um usuário será utilizado o usuário autenticado pelo token*
  - `region` (object, opcional): Novas coordenadas da região.
- **Resposta de sucesso:**
  - Código: 201
  - Corpo:
  ```json
    {
      "updatedRegion": {
		  "_id": "6650cfdace5fc08558f51869",
		  "name": "adm region",
		  "region": {
			  "type": "Polygon",
			  "coordinates": [
				[
					[
						-40.36337744086629,
						-3.665467668665883
					],
					[
						-40.36337744086629,
						-3.7025787359750666
					],
					[
						-40.327369760237275,
						-3.7025787359750666
					],
					[
						-40.327369760237275,
						-3.665467668665883
					],
					[
						-40.36337744086629,
						-3.665467668665883
					  ]
				  ]
			  ]
		  },
		  "user": "664b97d8c8e275465cb67a69",
		  "createdAt": "2024-05-24T17:35:22.067Z",
		  "updatedAt": "2024-05-24T18:35:25.519Z",
		  "__v": 0
	    }
    }
  ```

- **Possíveis erros:**
  - Código: 404
  - Corpo:
  ```json
    {
      "message": "Region not found"
    }
  ```

#### 4. Buscar todas as regiões que possuem um ponto especifico. (Auth)

- **Endpoint:** `/region`
- **Método HTTP:** GET
- **Query:**
  - `lat` (number, obrigatório): Latitude do ponto.
  - `lng` (number, obrigatório): Longitude do ponto.

- **Resposta de sucesso:**
  - Código: 201
  - Corpo:
  ```json
    [
	{
		"_id": "6650f353d3025c9a97c4b3f8",
		"name": "admin region",
		"region": {
			"type": "Polygon",
			"coordinates": [
				[
					[
						-40.36337744086629,
						-3.665467668665883
					],
					[
						-40.36337744086629,
						-3.7025787359750666
					],
					[
						-40.327369760237275,
						-3.7025787359750666
					],
					[
						-40.327369760237275,
						-3.665467668665883
					],
					[
						-40.36337744086629,
						-3.665467668665883
					]
				]
			]
		},
		"user": "6650f33ed3025c9a97c4b3f3",
		"createdAt": "2024-05-24T20:06:43.538Z",
		"updatedAt": "2024-05-24T20:06:43.538Z",
		"__v": 0
	},
	{
		"_id": "66523f4a802d5287c01251c9",
		"name": "Sylvia Roob",
		"region": {
			"type": "Polygon",
			"coordinates": [
				[
					[
						168.2468,
						-75.1624
					],
					[
						-133.5366,
						-55.1705
					],
					[
						-96.4315,
						26.86
					],
					[
						-83.5249,
						-50.3432
					],
					[
						-36.6558,
						19.4644
					]
				]
			]
		},
		"user": "66523f4a802d5287c01251c3",
		"createdAt": "2024-05-25T19:43:06.176Z",
		"updatedAt": "2024-05-25T19:43:06.176Z",
		"__v": 0
	}
  ]
  ```

Caso não possua nenhuma região:

  - Código: 404
  - Corpo:
  ```json
    {
      "message": "No regions found"
    }
  ```

#### 5. Buscar todas as regiões dentro de uma distância de um ponto. (Auth)

- **Endpoint:** `/region`
- **Método HTTP:** GET
- **Query:**
  - `lat` (number, obrigatório): Latitude do ponto.
  - `lng` (number, obrigatório): Longitude do ponto.
  - `distance` (number, Obrigatório): Distancia do raio da busca
  - `unit` ("meters" | "kilometers", Obrigatório): Unidade de medida da distancia fornecida.
  - `fromUser` (boolean, Obrigatório): Boolean que indica se a busca deve ser feita apenas do usuário logado.

- **Resposta de sucesso:**
  - Código: 201
  - Corpo:
  ```json
    [
	{
		"_id": "6650f353d3025c9a97c4b3f8",
		"name": "admin region",
		"region": {
			"type": "Polygon",
			"coordinates": [
				[
					[
						-40.36337744086629,
						-3.665467668665883
					],
					[
						-40.36337744086629,
						-3.7025787359750666
					],
					[
						-40.327369760237275,
						-3.7025787359750666
					],
					[
						-40.327369760237275,
						-3.665467668665883
					],
					[
						-40.36337744086629,
						-3.665467668665883
					]
				]
			]
		},
		"user": "6650f33ed3025c9a97c4b3f3",
		"createdAt": "2024-05-24T20:06:43.538Z",
		"updatedAt": "2024-05-24T20:06:43.538Z",
		"__v": 0
	},
	{
		"_id": "66523f4a802d5287c01251c9",
		"name": "Sylvia Roob",
		"region": {
			"type": "Polygon",
			"coordinates": [
				[
					[
						168.2468,
						-75.1624
					],
					[
						-133.5366,
						-55.1705
					],
					[
						-96.4315,
						26.86
					],
					[
						-83.5249,
						-50.3432
					],
					[
						-36.6558,
						19.4644
					]
				]
			]
		},
		"user": "66523f4a802d5287c01251c3",
		"createdAt": "2024-05-25T19:43:06.176Z",
		"updatedAt": "2024-05-25T19:43:06.176Z",
		"__v": 0
	}
  ]
  ```

Caso não possua nenhuma região:

  - Código: 404
  - Corpo:
  ```json
    {
      "message": "No regions found"
    }
  ```


#### 6. Deletar uma região. (Auth)

- **Endpoint:** `/region/:id`
- **Método HTTP:** DELETE
- **Parâmetros:**
  - `id` (string, obrigatório): ID da região.
- **Resposta de sucesso:**
  - Código: 200
  - Corpo:
  ```json
    {
      "deletedRegion": {
        "_id": "ID da região",
        "name": "Nome da região",
        "user": "ID do usuário associado",
        "region": {
          "type": "Tipo de região",
          "coordinates": "Coordenadas da região"
        }
      }
    }
  ```
- **Possíveis erros:**
  - Código: 404
  - Corpo:
  ```json
    {
      "message": "Região não encontrada"
    }
  ```

### Mensagem do desenvolvedor

Obrigado por considerar meu teste tecnico. Foquei o máximo possível nas validações, autenticações e na clareza das mensagens de erro. Espero que gostem do projeto tanto quanto eu gostei de desenvolver.
