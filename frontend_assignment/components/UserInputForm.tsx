import React from 'react'
import styles from "../styles/Form.module.css"
import { useForm } from "react-hook-form";

const UserInputForm = ({onSubmit} : {onSubmit: (data: any) => Promise<boolean>}) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const doSubmit = async (data: any) => {
    console.log(data)
    if (await onSubmit(data))
      reset() // reset the form only if message is successfully submitted to blockchain
  }

  return (
    <form className={styles.formctn} onSubmit={handleSubmit(doSubmit)}>

      <div className={styles.formfieldctn}>
        <input className={styles.formfield} placeholder="Enter Name" {...register("name", { 
          required: "Name is required", 
          minLength: {value: 2, message: "You must enter at least 2 characters"}, 
          maxLength: {value: 20, message: "Name too long"},
        })} />
        <p className={styles.formfielderr}>{errors.name?.message}</p>
      </div>
      <div className={styles.formfieldctn}>
        <input className={styles.formfield} placeholder="Enter Age" type="number" {...register("age", { 
          min: {value: 18, message: "You must be older than 18"}, 
          max: {value: 99, message: "You are too old to be here"},
        })} />
        <p className={styles.formfielderr}>{errors.age?.message}</p>
      </div>    
      <div className={styles.formfieldctn}>
        <input className={styles.formfield} placeholder="Enter Address" type="text" {...register("address", { 
          required: "Address is required",
        })} />
        <p className={styles.formfielderr}>{errors.address?.message}</p>
      </div>  
      <div className={styles.formbuttonctn}>
        <input className={styles.formbutton} type="submit" value="Greet" />
      </div>

    </form>
  );
}

export default UserInputForm
