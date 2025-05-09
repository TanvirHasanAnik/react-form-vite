import './App.css';
import {z} from 'zod'
import {useForm} from 'react-hook-form'
import {DevTool} from "@hookform/devtools"
import {zodResolver} from '@hookform/resolvers/zod';
import { VKButton,VKCheckbox,VKInput } from "@vivakits/react-components";



const formSchema = z.object({
  username: z.string().nonempty("Username is required").min(3,"Username must be atleast 3 characters long").max(15, "username can't be more than 15 characters"),
  password: z.string().nonempty("Password is required").min(6,"password must contain atleast 6 characters").max(25,"password must not exceed 25 characters"),
  age: z.number({invalid_type_error: "Age is required",}).gt(18,"Must be adult").lt(150,"Give a realistic age"),
  email: z.string().nonempty("Email is required").email("invalid email"),
  isStudent: z.boolean(),
  gender: z.preprocess(val => val === '' ? undefined : val, z.enum(["male", "female", "others"], { required_error: "Please select gender" })) as z.ZodType<"male" | "female" | "others">,
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
    <div className="App w-full">
      <header className="App-header">
      </header>
      <main>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VKInput type='text' id='username' variant="outline" hasError={errors.username} errorMessage={errors?.username?.message} {...register("username")}  rounded="xl" label="Username"/>
          <VKInput type="password" id="password" variant="outline" hasError={errors.password} errorMessage={errors?.password?.message} {...register("password")} rounded="xl" label="Password"/>
          <VKInput label="age" type="number" id="age"  hasError={errors.age} errorMessage={errors?.age?.message} {...register("age",{valueAsNumber: true})} rounded="xl" variant="outline"/>
          <VKInput label="email" type="email" id="email"  hasError={errors.email} errorMessage={errors?.email?.message} {...register("email")} rounded="xl" variant="outline"/>
          <VKCheckbox rounded="full" id="isStudent" {...register("isStudent")}>Student</VKCheckbox>
          {errors.isStudent && <p style={{ color: 'red' }}>{errors.isStudent.message}</p>}

          <label htmlFor="gender">Gender</label>
          <select id="gender" {...register("gender")} ge>
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

          <VKButton type='submit' size="md" rounded="md">
            Medium
          </VKButton>
        </form>
        <DevTool control={control}/>
      </main>
    </div>
  );
}

export default App;
