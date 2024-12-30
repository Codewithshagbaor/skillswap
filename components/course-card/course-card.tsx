import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, GraduationCap } from 'lucide-react'

interface Course {
  id: string
  title: string
  description: string
  price: string
  duration: string
  instructor: string
  image: string
  level: string
}

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.id}`}>
      <Card className="overflow-hidden transition-transform hover:scale-[1.02]">
        <div className="relative aspect-video">
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-cover"
          />
        </div>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              {course.level}
            </Badge>
            <span className="text-lg font-bold text-purple-600">{course.price}</span>
          </div>
          <h3 className="text-xl font-semibold">{course.title}</h3>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {course.description}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {course.duration}
          </div>
          <div className="flex items-center gap-1">
            <GraduationCap className="h-4 w-4" />
            {course.instructor}
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
