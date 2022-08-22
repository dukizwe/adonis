import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Category from 'App/Models/Category'
import Drive from '@ioc:Adonis/Core/Drive'
import Post from 'App/Models/Post'
import UpdatePostValidator from 'App/Validators/UpdatePostValidator'
import { string } from '@ioc:Adonis/Core/Helpers'

export default class BlogController {
          async index ({ view, request }: HttpContextContract) {
                    try {
                              // const posts = await Post.all()
                              const page = request.input('page', 1)
                              const posts = await Database.from(Post.table).paginate(page, 2)
                              return view.render('blog/index', {
                                        posts
                              })
                    } catch (error) {
                              console.log(error)
                    }
          }

          async show ({ view, params, bouncer }: HttpContextContract) {
                    const post = await Post.findOrFail(params.id)
                    // await bouncer.authorize('editPost', post)
                    // const post = await Post.query().preload('category').where('id', params.id).firstOrFail()
                    const categories = await Category.all()
                    return view.render('blog/show', { post, categories })
          }

          async store ({ params, request, session, response }:HttpContextContract) {
                    await this.handleRequest(params, request)
                    session.flash({ success: "L'article a bien éte ajoutée"})
                    return response.redirect().toRoute('home')
          }

          async create({ view}: HttpContextContract) {
                    const post = new Post()
                    const categories = await Category.all()
                    return view.render('blog/create', { post, categories })
          }

          async update ({ params, request, response, session, bouncer }: HttpContextContract) {
                    await this.handleRequest(params, request, bouncer)
                    session.flash({ success: "L'article a bien éte modifiée"})
                    return response.redirect().toRoute('home')
          }

          async destroy({ params, response, session }: HttpContextContract) {
                    const post = await Post.findOrFail(params.id)
                    await post.delete()
                    session.flash({ success: "L'article a bien éte supprimé"})
                    return response.redirect().toRoute('home')
          }

          private async handleRequest(params: HttpContextContract['params'], request: HttpContextContract['request'], bouncer?: HttpContextContract['bouncer']) {
                    const post = params.id ? await Post.findOrFail(params.id) : new Post()
                    const thumbnail = request.file('thumbnail')
                    if(thumbnail) {
                              if(post.thumbnail) {
                                        await Drive.delete(post.thumbnail)
                              }
                              const fileName = `${string.generateRandom(32)}.${thumbnail.extname}`
                              await thumbnail.moveToDisk('./', { name: fileName })
                              post.thumbnail = fileName
                    } 
                    /* if(bouncer) {
                              await bouncer.authorize('editPost', post)
                    } */
                    const data = await request.validate(UpdatePostValidator)
                    post.merge({ title: data.title, categoryId: data.categoryId, content: data.content, online: data.online || false }).save()
          }
}
