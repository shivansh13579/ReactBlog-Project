import React,{useEffect,useCallback} from 'react'
import appwriteService from '../../appwrite/config'
import {Button,Logo,Input,RTE} from '../index'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'


function PostForm1({post}) {
    const {register,handleSubmit,watch,setValue,control,getValues} = useForm({
          defaultValues:{
            title: post?.title || "",
            slug:post?.slug || "",
            content: post?.content || "",
            status: post?.status || 'active', 
          }
    })

    const navigate = useNavigate()

    const userData = useSelector(state => state.user.userData)

    const submit = async (data) => {
         if(post){
          const file = data.Image[0]?.appwriteService.uploadFile(data.Image[0])

          if(file){
            appwriteService.deleteFile(post.featuredImage)
          }
          const dbPost = appwriteService.updatePost(post.$id,{
            ...data,
            featuredImage: file ? file.$id : undefined
          })
          if(dbPost){
            navigate(`/post/${dbPost.$id}`)
          }
         }
         else{
          const file = await appwriteService.uploadFile(data.Image[0])

          if(file){
            const fileId = file.$id
            data.featuredImage =fileId
            const dbPost = await appwriteService.createPost({
              ...data,
              userId : userData.$id
            })
            if(dbPost){
              navigate(`/post/${dbPost.$id}`)
            }
          }
         }
    }

    const slugTransform = useCallback((value)=>{
      if(value && typeof value ==="string")
      return value
    .trim()
    .toLowerCase()
    .replace(/\s/g,'-')

    return ''
    },[])
    
  return (
    <div>
      
    </div>
  )
}

export default PostForm1
