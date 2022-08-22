import { test } from '@japa/runner'

test.group('Test 404', () => {
          // Write your test here
          test('display 404 page', async ({ client }) => {
                    const response = await client.get('/jsjs')

                    response.assertStatus(404)
          })
})
