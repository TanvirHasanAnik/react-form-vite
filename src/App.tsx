import { DevTool } from "@hookform/devtools";
import { zodResolver } from '@hookform/resolvers/zod';
import { VKButton, VKCheckbox, VKGroup, VKInput, VKLayout } from "@vivakits/react-components";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import './App.css';



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
  const [tab, setTab] = useState("form");

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
    <VKLayout orientation="horizontal">
      <div className="w-60 bg-blue-100 text-center text-white flex flex-col justify-start items-center gap-4 p-4">
      <VKButton size="md" rounded="lg" className="w-full" onClick={() => setTab("list")}>
        List
      </VKButton>
      <VKButton size="md" rounded="lg" className="w-full" onClick={() => setTab("add-person")}>
        Add Person
      </VKButton>
      <VKButton size="md" rounded="lg" className="w-full" onClick={() => setTab("form")}>
        Form
      </VKButton>
      </div>
    <div className="w-full flex flex-col justify-center items-center">
      {tab === "list" && 
      <table className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-200">
            <th className="p-3">Username</th>
            <th className="p-3">Age</th>
            <th className="p-3">Email</th>
            <th className="p-3">Gender</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-gray-50 border-b border-gray-200">
            <td>Tanvir</td>
            <td>25</td>
            <td>asd@gmail.com</td>
            <td>Male</td>
            <td>
            <div className="flex flex-wrap items-start gap-2 p-3">
                  <VKGroup
                    rounded={"sm"}
                    childrenProps={
                      {
                        variant: "outline",
                        className: "border-0",
                      }
                    }
                    size="md"
                  >
                    <VKButton>View</VKButton>
                    <VKButton>Delete</VKButton>
                    <VKButton>Edit</VKButton>
                  </VKGroup>
            </div>
            </td>
          </tr>
          <tr className="bg-gray-50 border-b border-gray-200">
            <td className="p-3">Anik</td>
            <td className="p-3">25</td>
            <td className="p-3">asd@gmail.com</td>
            <td className="p-3">Male</td>
            <td>
            <div className="flex flex-wrap items-start gap-2 p-3">
                  <VKGroup
                    rounded={"sm"}
                    childrenProps={
                      {
                        variant: "outline",
                        className: "border-0",
                      }
                    }
                    size="md"
                  >
                    <VKButton>View</VKButton>
                    <VKButton>Delete</VKButton>
                    <VKButton>Edit</VKButton>
                  </VKGroup>
            </div>
            </td>
          </tr>
        </tbody>
      </table>
      }
      {tab === "add-person" && <h1 className="text-2xl font-bold"></h1>}
      {tab === "form" && 
      <main className="App-main"> 
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <VKInput type='text' id='username' variant="outline" hasError={errors.username} errorMessage={errors?.username?.message} {...register("username")}  rounded="xl" label="Username"/>
          <VKInput type="password" id="password" variant="outline" hasError={errors.password} errorMessage={errors?.password?.message} {...register("password")} rounded="xl" label="Password"/>
          <VKInput label="age" type="number" id="age"  hasError={errors.age} errorMessage={errors?.age?.message} {...register("age",{valueAsNumber: true})} rounded="xl" variant="outline"/>
          <VKInput label="email" type="email" id="email"  hasError={errors.email} errorMessage={errors?.email?.message} {...register("email")} rounded="xl" variant="outline"/>
          <VKCheckbox rounded="full" id="isStudent" {...register("isStudent")}>Student</VKCheckbox>
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

          <VKButton type='submit' size="md" rounded="md">
            Submit
          </VKButton>
        </form>
        <DevTool control={control}/>
      </main>
      }
    </div>
    </VKLayout>
  );
}

export default App;
