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
            });

         }
    }
  return (
    <div>
      
    </div>
  )
}

export default PostForm
