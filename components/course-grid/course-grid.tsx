import { CourseCard } from "@/components/course-card/course-card"

const COURSES = [
  {
    id: "1",
    title: "Introduction to Web3 Development",
    description: "Learn the fundamentals of Web3 development including smart contracts, DApps, and blockchain basics.",
    price: "0.5 ETH",
    duration: "8 weeks",
    instructor: "Alex Thompson",
    image: "/img/dummy.jpg",
    level: "Beginner"
  },
  {
    id: "2",
    title: "Smart Contract Development",
    description: "Master Solidity programming and learn to write secure smart contracts",
    price: "0.8 ETH",
    duration: "10 weeks",
    instructor: "Sarah Chen",
    image: "/img/dummy.jpg",
    level: "Intermediate"
  },
  {
    id: "3",
    title: "DeFi Protocol Development",
    description: "Build decentralized finance applications and understand DeFi protocol architecture.",
    price: "1.2 ETH",
    duration: "12 weeks",
    instructor: "Michael Rodriguez",
    image: "/img/dummy.jpg",
    level: "Advanced"
  },

]

export function CourseGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {COURSES.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}

