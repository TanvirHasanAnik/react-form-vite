import './App.css';
import {z} from 'zod'
import {useForm} from 'react-hook-form'
import {DevTool} from "@hookform/devtools"
import {zodResolver} from '@hookform/resolvers/zod';
import { VKGroup,VKInput } from "@vivakits/react-components";



const formSchema = z.object({
  username: z.string().nonempty("Username is required").min(3,"Username must be atleast 3 characters long").max(15, "username can't be more than 15 characters"),
  password: z.string().nonempty("Password is required").min(6,"password must contain atleast 6 characters").max(25,"password must not exceed 25 characters"),
  age: z.number({invalid_type_error: "Age is required",}).gt(18).lt(150),
  email: z.string().nonempty("Email is required").email("invalid email"),
  isStudent: z.boolean(),
  gender: z.enum(["male","female","others"],{required_error: "Please select gender"}),
  date: z.string().nonempty("Please provide a date"),
  time: z.string().nonempty("Please provide a time"),
})

type formValues = z.infer<typeof formSchema>;

function App() {
  const form = useForm<formValues>({resolver: zodResolver(formSchema), mode: "onBlur"});
  const {register, control, handleSubmit, formState: { errors }} = form;

  const onSubmit = function (data: formValues){
    console.log("form submitted",data);
    try{
      console.log(formSchema.parse(data))
    }catch (error){
      if(error instanceof z.ZodError){
        console.log(error)
        const zodError = error.errors
        console.log(zodError)
        zodError.forEach(
          (error) => {
            console.log(error.message)
          }
        )
      }
      else console.log(error)
    }
  }
   console.log('rendered')
   console.log(errors)
  return (
    <div className="App bg-blue-100">
      <header className="App-header">
      </header>
      <main>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VKGroup color="none" noSeparator border="none">
      <VKInput variant="outline" label="Primary" color="primary" />
      <VKInput variant="outline" label="Secondary" color="secondary" />
      <VKInput variant="outline" label="Success" color="success" />
      <VKInput variant="outline" label="Warning" color="warning" />
      <VKInput variant="outline" label="Danger" color="danger" />
      <VKInput variant="outline" label="Light" color="light" />
    </VKGroup>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" {...register("username")}/>
          {errors.username && <p style={{ color: 'red' }}>{errors.username.message}</p>}

          <label htmlFor="password">Password</label>
          <input type="password" id="password" {...register("password")}/>
          {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}

          <label htmlFor="age">Age</label>
          <input type="number" id="age" {...register("age",{valueAsNumber: true})}/>
          {errors.age && <p style={{ color: 'red' }}>{errors.age.message}</p>}

          <label htmlFor="email">Email</label>
          <input type="email" id="email" {...register("email")}/>
          {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}

          <label htmlFor="isStudent">Student</label>
          <input type="checkbox" id="isStudent" {...register("isStudent")}/>
          {errors.isStudent && <p style={{ color: 'red' }}>{errors.isStudent.message}</p>}

          <label htmlFor="gender">Gender</label>
          <select id="gender" {...register("gender")}>
            <option value="" disabled selected hidden>Select gender</option>
            <option value = "male">Male</option>
            <option value = "female">Female</option>
            <option value = "others">Others</option>
          </select>
          {errors.gender && <p style={{ color: 'red' }}>{errors.gender.message}</p>}

          <label htmlFor="date">Date</label>
          <input type="date" id="date" {...register("date")}/>
          {errors.date && <p style={{ color: 'red' }}>{errors.date.message}</p>}

          <label htmlFor="time">Time</label>
          <input type="time" id="time" {...register("time")}/>
          {errors.time && <p style={{ color: 'red' }}>{errors.time.message}</p>}

          <button type='submit'>Submit</button>
        </form>
        <DevTool control={control}/>
      </main>
    </div>
  );
}

export default App;
