import { test } from '@japa/runner'

test('display welcome page', async ({ client }) => {
  const response = await client.get('/')

  response.assertStatus(200)
  response.assertTextIncludes('<h1 class="display-4 fw-normal">Bienvenu sur mon blog</h1>')
})
