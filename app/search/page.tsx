'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from 'lucide-react'
import { CourseCard } from "@/components/course-card/course-card"

// Mock data for demonstration
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
    title: "Smart Contract Development with Solidity",
    description: "Master Solidity programming and learn to write secure smart contracts for Ethereum.",
    price: "0.8 ETH",
    duration: "10 weeks",
    instructor: "Sarah Chen",
    image: "/img/dummy.jpg",
    level: "Intermediate"
  },
  // Add more courses as needed
]

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState(COURSES)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Filter courses based on search query
    const filteredCourses = COURSES.filter(course =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setSearchResults(filteredCourses)
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-2xl font-bold mb-6">Search Courses</h1>
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search for courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </form>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {searchResults.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
      {searchResults.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No courses found. Try a different search term.</p>
      )}
    </div>
  )
}
