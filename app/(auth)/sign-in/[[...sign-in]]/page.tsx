import { SignIn } from "@clerk/nextjs"

const SignInPage = () => {
  return (
    <main className="min-h-screen grid place-content-center py-10">
      <SignIn />
    </main>
  )
}
export default SignInPage
