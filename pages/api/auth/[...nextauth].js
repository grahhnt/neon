import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
export default NextAuth({
  site: process.env.NEXTAUTH_URL,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    })
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if(user?.email !== process.env.GITHUB_USER_EMAIL) {
        return false;
      }
      
      return true;
    }
  }
})
