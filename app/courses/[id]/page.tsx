import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, GraduationCap } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"

// This would normally fetch from an API
const getCourse = (id: string) => {
  return {
    id,
    title: "Introduction to Web3 Development",
    description: "Learn the fundamentals of Web3 development including smart contracts, DApps, and blockchain basics. This comprehensive course will take you from a complete beginner to being able to build your own decentralized applications.",
    price: "0.5 ETH",
    duration: "8 weeks",
    instructor: "Alex Thompson",
    image: "/img/dummy.jpg",
    level: "Beginner",
    curriculum: [
      "Introduction to Blockchain Technology",
      "Understanding Smart Contracts",
      "Ethereum Development Environment",
      "Solidity Programming Basics",
      "Web3.js and Ethers.js",
      "Building Decentralized Applications",
      "Testing and Deployment",
      "Best Practices and Security"
    ]
  }
}

export default function CoursePage({ params }: { params: { id: string } }) {
  const course = getCourse(params.id)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8 mx-auto">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="relative aspect-video mb-6">
              <Image
                src={course.image}
                alt={course.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <p className="text-muted-foreground mb-6">
              {course.description}
            </p>
            <div className="grid gap-4">
              <h2 className="text-xl font-semibold">Course Curriculum</h2>
              <ul className="grid gap-2">
                {course.curriculum.map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-purple-800 text-sm">
                      {index + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <div className="grid gap-6">
                <div className="flex justify-between items-center">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    {course.level}
                  </Badge>
                  <span className="text-2xl font-bold text-purple-600">{course.price}</span>
                </div>
                <div className="grid gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    {course.instructor}
                  </div>
                </div>
                <Link href={`/checkout/${course.id}`}>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Purchase Course
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}

