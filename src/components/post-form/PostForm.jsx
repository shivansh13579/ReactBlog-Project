import React,{useCallback} from 'react';
import { useForm } from 'react-hook-form';
import appwriteService from '../../appwrite/config';
import {Button,Logo,RTE,Input} from '../index'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function PostForm({post}) {
    const {register,handleSubmit,watch,setValue,control,getValues} = useForm({
        defaultValues: {
          title: post?.title || '',
          slug: post?.slug || '',
          content: post?.content || '',
          status: post?.status || 'active'
        }
    });
    const navigate = useNavigate()
    const useData = useSelector(state => state.user.userData)

    const submit  = async(data)=>{
         if(post){
            const file = data.image[0] ? appwriteService.uploadFile(data.image[0]) : null

            if(file){
                appwriteService.deleteFile(post.featuredImage)
            }

            const dbPost = await appwriteService.updatePost(post.$id,{
                ...data,
                featuredImage: file ? file.$id : undefined
            })
            if(dbPost){
              navigate(`/post/${dbPost.$id}`)
            }
         }else{
          const file = await appwriteService.uploadFile(data.image[0])

          if(file){
            const fileId = file.$id
            data.featuredImage = fileId
           const dbPost = await appwriteService.createPost({
              ...data,
              userId: useData.$id,
            })
            if(dbPost){
              navigate(`/post/${dbPost.$id}`)
            }
          }
         }
    }

    const slugTransform = useCallback((value)=>{
             if(value && typeof value === 'string')
             return value
            .trim()
            .toLowerCase()
            .replace(/\s/g,'-')

            return ''
    },[])

    React.useEffect(()=>{
      const subscription = watch((value,{name})=>{
        if(name === 'title'){
          setValue('slug',slugTransform(value.title,{shouldValidate: true}))
        }
      })
      
      return () => {
        subscription.unsubscribe()
      }
    },[watch,slugTransform,setValue])
  return (
      <form onSubmit={handleSubmit(submit)} className='flex flex-wrap'>
      <div className='w-2/3 px-2'>
      <Input
        label="Title: "
        placeholder="Title"
        className='mb-4'
        {...register("title",{required: true})}
      />

      </div>

      </form>
  )
}

export default PostForm
