import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock user data for demonstration
const USER = {
  name: "John Doe",
  email: "john@example.com",
  avatar: "/placeholder.svg?height=100&width=100",
  coursesUploaded: 5,
  coursesPurchased: 12,
}

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-2xl font-bold mb-6 text-purple-800">User Profile</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={USER.avatar} alt={USER.name} />
              <AvatarFallback>{USER.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-purple-800">{USER.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{USER.email}</p>
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-purple-800">Course Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Courses Uploaded</dt>
                <dd className="text-2xl font-bold">{USER.coursesUploaded}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Courses Purchased</dt>
                <dd className="text-2xl font-bold">{USER.coursesPurchased}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

