import { DevTool } from "@hookform/devtools";
import { zodResolver } from '@hookform/resolvers/zod';
import { VKEmpty,VKButton, VKCheckbox, VKGroup, VKInput,VKSelect, VKLayout } from "@vivakits/react-components";
import { useRef,useState } from 'react';
import { useForm,Controller } from 'react-hook-form';
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

const genderOptions = [
    { label: 'Male', value: "0" },
    { label: 'Female', value: "1" },
    { label: 'Others', value: "2" }
  ]



const addFormSchema = z.object({
  id:z.number().optional(),
  username: z.string().nonempty("Username is required").min(3,"Username must be atleast 3 characters long").max(15, "username can't be more than 15 characters"),
  age: z.number({invalid_type_error: "Age is required",}).gt(18,"Must be adult").lt(150,"Give a realistic age"),
  email: z.string().nonempty("Email is required").email("invalid email"),
  gender: z.object({
    value:z.string().nullable(),
    label:z.string().nullable()
  }),
})

type formValues = z.infer<typeof formSchema>;
type addFormValues = z.infer<typeof addFormSchema>;

function App() {
  const [tab, setTab] = useState("list");
  const [personList, setPersonList] = useState<addFormValues []>([]);
  const personId = useRef(0);

  const form = useForm<formValues>({resolver: zodResolver(formSchema), mode: "onBlur"});
  const addForm = useForm<addFormValues>({resolver: zodResolver(addFormSchema), mode: "onBlur"});
  const {register, control, handleSubmit, formState: { errors }} = form;
  const {register: addRegister, control:addControl, handleSubmit: addHandleSubmit, formState: { errors: addErrors }} = addForm;

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

  const onAddSubmit = function (data: addFormValues){
    console.log("form submitted --------------------------------",data);
    const newPerson = {
      id: personId.current += 1,
      username: data.username,
      age: data.age,
      email: data.email,
      gender: data.gender,
    }
    setPersonList([...personList,newPerson])
    setTab("list")
  }

  
  function handleDelete(id: number) {
    const newPersonList = personList.filter((person) => {
      return person.id !== id
    })
    setPersonList(newPersonList)
  }
  // console.log('rendered')
  // console.log(errors)
  // console.log("person list",personList)
  return (
    <div className="flex flex-col gap-4 h-screen">
      <div className="w-full bg-blue-100 rounded-lg flex">
        <div className="w-60 p-4 text-center box-border">
        </div>
        <div className="p-4">{tab}</div>
      </div>
      <VKLayout orientation="horizontal" className="h-full" gap="md">
        <div className="w-60 bg-accent-foreground rounded-lg text-white flex flex-col justify-start items-center gap-4 p-4 ">
          <VKButton size="md" rounded="lg" className="w-full focus:outline-none" variant="light" onClick={() => setTab("list")}>
            Person list
          </VKButton>
          <VKButton size="md" rounded="lg" className="w-full focus:outline-none" variant="light" onClick={() => setTab("add-person")}>
            Add Person
          </VKButton>
          <VKButton size="md" rounded="lg" className="w-full focus:outline-none" variant="light" onClick={() => setTab("form")}>
            Form
          </VKButton>
        </div>
      <div className="w-full flex flex-col items-center h-full">
        
        <main className="App-main w-full flex flex-col p-8 bg-accent-foreground rounded-lg h-full"> 
        {tab === "list" &&
        <>
        {
        personList.length > 0 ?
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
            {personList.map((person: addFormValues)=>{
              return <>
              <tr key={person.id} className="bg-gray-50 border-b border-gray-200">
                <td className="p-3 max-w-[150px] truncate">{person.username}</td>
                <td className="p-3 max-w-[100px] truncate">{person.age}</td>
                <td className="p-3 max-w-[150px] truncate">{person.email}</td>
                <td className="p-3 max-w-[100px] truncate">{person.gender.label}</td>
                <td className="p-3">
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
                        <VKButton onClick={() => handleDelete(person.id)}>Delete</VKButton>
                        <VKButton>Edit</VKButton>
                      </VKGroup>
                </div>
                </td>
              </tr>
              </>
            })}
          </tbody>
        </table> : 
        <VKEmpty/>
        }
        <VKButton size="md" rounded="lg" className="w-full my-8" variant="outline" onClick={() => setTab("add-person")}>
          Add Person
        </VKButton>
        </>
        }
        {tab === "add-person" && 
          <>
            <form onSubmit={addHandleSubmit(onAddSubmit)} className="w-full">
              <div className="flex flex-col items-start bg-primary-foreground rounded-xl p-5 gap-4 w-full">
                <div className="add_person_inputs w-full grid grid-cols-2 gap-4">
                  <VKInput size="sm" label="Username" placeholder="Enter username" type='text' id='username' hasError={addErrors.username !== undefined} errorMessage={addErrors?.username?.message} {...addRegister("username")}  rounded="md" />
                  <VKInput size="sm" label="Age" placeholder="Enter age" type="number" id="age"  hasError={addErrors.age !== undefined} errorMessage={addErrors?.age?.message} {...addRegister("age",{valueAsNumber: true})} rounded="md"/>
                  <VKInput size="sm" label="E-mail" placeholder="Enter email" type="email" id="email"  hasError={addErrors.email !== undefined} errorMessage={addErrors?.email?.message} {...addRegister("email")} rounded="md"/>
                  
                  <Controller
                    name="gender"
                    control={addControl}
                    render={({ field }) => (
                      <VKSelect
                        label="Gender"
                        placeholder="Select Gender"
                        rounded="sm"
                        hasError={addErrors.gender !== undefined} 
                        errorMessage={addErrors?.gender?.message}
                        options={genderOptions}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
                <div>
                  <VKButton type='submit' size="md" rounded="md" variant="outline">
                    Add person
                  </VKButton>
                </div>
              </div>
            </form>
          </>
        }
        {tab === "form" && <>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <VKInput type='text' id='username' variant="outline" hasError={errors.username !== undefined} errorMessage={errors?.username?.message} {...register("username")}  rounded="xl" label="Username"/>
            <VKInput type="password" id="password" variant="outline" hasError={errors.password !== undefined} errorMessage={errors?.password?.message} {...register("password")} rounded="xl" label="Password"/>
            <VKInput label="age" type="number" id="age"  hasError={errors.age !== undefined} errorMessage={errors?.age?.message} {...register("age",{valueAsNumber: true})} rounded="xl" variant="outline"/>
            <VKInput label="email" type="email" id="email"  hasError={errors.email !== undefined} errorMessage={errors?.email?.message} {...register("email")} rounded="xl" variant="outline"/>
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

            <VKButton type='submit' size="md" rounded="md" variant="outline">
              Submit
            </VKButton>
          </form>
          <DevTool control={control}/>
        </>
        }
        </main>
      </div>
      </VKLayout>
    </div>
  );
}

export default App;
