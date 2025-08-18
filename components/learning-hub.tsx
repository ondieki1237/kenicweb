"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  BookOpen,
  Play,
  Clock,
  Users,
  Star,
  Award,
  Search,
  Filter,
  Download,
  CheckCircle,
  FileText,
  Video,
  Headphones,
  Globe,
  Shield,
  TrendingUp,
} from "lucide-react"

export default function LearningHub() {
  const [activeSection, setActiveSection] = useState("courses")
  const [searchQuery, setSearchQuery] = useState("")

  const courses = [
    {
      id: 1,
      title: "Complete Guide to .KE Domain Management",
      instructor: "Dr. Sarah Kiprotich",
      instructorAvatar: "/expert-sarah.png",
      duration: "4.5 hours",
      students: 1250,
      rating: 4.9,
      level: "Beginner",
      category: "Domain Management",
      progress: 0,
      lessons: 12,
      description: "Master the fundamentals of managing .KE domains, from registration to advanced DNS configuration.",
      thumbnail: "/course-domain-management.png",
      price: "Free",
      tags: ["DNS", "Domain", "Beginner"],
    },
    {
      id: 2,
      title: "Advanced DNS Security for .KE Domains",
      instructor: "James Ochieng",
      instructorAvatar: "/expert-james.png",
      duration: "6.2 hours",
      students: 890,
      rating: 4.8,
      level: "Advanced",
      category: "Security",
      progress: 35,
      lessons: 18,
      description: "Learn advanced security techniques to protect your .KE domains from cyber threats.",
      thumbnail: "/course-dns-security.png",
      price: "KSh 2,500",
      tags: ["Security", "DNS", "Advanced"],
    },
    {
      id: 3,
      title: "SEO Optimization for Kenyan Businesses",
      instructor: "Grace Wanjiku",
      instructorAvatar: "/customer-avatar-grace.png",
      duration: "3.8 hours",
      students: 2100,
      rating: 4.7,
      level: "Intermediate",
      category: "Marketing",
      progress: 0,
      lessons: 15,
      description: "Optimize your .KE domain for search engines and improve your local SEO rankings.",
      thumbnail: "/course-seo-optimization.png",
      price: "KSh 1,800",
      tags: ["SEO", "Marketing", "Business"],
    },
  ]

  const tutorials = [
    {
      id: 1,
      title: "How to Register Your First .KE Domain",
      type: "video",
      duration: "8 min",
      views: 15400,
      category: "Getting Started",
      difficulty: "Beginner",
      thumbnail: "/tutorial-register-domain.png",
    },
    {
      id: 2,
      title: "Setting Up M-Pesa Payments for Domain Renewals",
      type: "article",
      readTime: "5 min",
      views: 8900,
      category: "Payments",
      difficulty: "Beginner",
      thumbnail: "/tutorial-mpesa-setup.png",
    },
    {
      id: 3,
      title: "Protecting Your Domain from Cybersquatting",
      type: "podcast",
      duration: "22 min",
      views: 5600,
      category: "Security",
      difficulty: "Intermediate",
      thumbnail: "/tutorial-cybersquatting.png",
    },
  ]

  const webinars = [
    {
      id: 1,
      title: "Future of .KE Domains: Trends and Opportunities",
      date: "March 20, 2025",
      time: "2:00 PM EAT",
      speaker: "Dr. Sarah Kiprotich",
      speakerTitle: "KeNIC Technical Director",
      attendees: 450,
      status: "upcoming",
      description: "Explore emerging trends in the .KE domain space and discover new opportunities for businesses.",
    },
    {
      id: 2,
      title: "Building Secure Web Applications on .KE Domains",
      date: "February 28, 2025",
      time: "3:00 PM EAT",
      speaker: "Peter Mwangi",
      speakerTitle: "Cybersecurity Expert",
      attendees: 320,
      status: "recorded",
      description: "Learn best practices for developing secure web applications using .KE domains.",
    },
  ]

  const achievements = [
    { id: 1, name: "Domain Expert", description: "Completed 5 domain courses", icon: "🏆", unlocked: true },
    { id: 2, name: "Security Specialist", description: "Mastered DNS security", icon: "🛡️", unlocked: true },
    { id: 3, name: "SEO Master", description: "Optimized 10+ domains", icon: "📈", unlocked: false },
    { id: 4, name: "Community Leader", description: "Helped 50+ users", icon: "👥", unlocked: false },
  ]

  const learningPaths = [
    {
      id: 1,
      title: "Domain Management Fundamentals",
      description: "Start your journey with .KE domain basics",
      courses: 4,
      duration: "12 hours",
      level: "Beginner",
      progress: 25,
      icon: <Globe className="h-8 w-8 text-blue-600" />,
    },
    {
      id: 2,
      title: "Advanced Security Practices",
      description: "Protect your domains from cyber threats",
      courses: 6,
      duration: "18 hours",
      level: "Advanced",
      progress: 0,
      icon: <Shield className="h-8 w-8 text-red-600" />,
    },
    {
      id: 3,
      title: "Business Growth with .KE",
      description: "Leverage .KE domains for business success",
      courses: 5,
      duration: "15 hours",
      level: "Intermediate",
      progress: 60,
      icon: <TrendingUp className="h-8 w-8 text-green-600" />,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Learning Hub Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif">Learning Hub</h1>
          <p className="text-muted-foreground">Master .KE domain management and grow your digital expertise</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses, tutorials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Learning Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">24</div>
            <div className="text-sm text-muted-foreground">Courses</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Play className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">156</div>
            <div className="text-sm text-muted-foreground">Tutorials</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">8,450</div>
            <div className="text-sm text-muted-foreground">Students</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">2</div>
            <div className="text-sm text-muted-foreground">Certificates</div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b">
        {["courses", "tutorials", "webinars", "paths", "achievements"].map((section) => (
          <Button
            key={section}
            variant={activeSection === section ? "default" : "ghost"}
            onClick={() => setActiveSection(section)}
            className="capitalize"
          >
            {section === "paths" ? "Learning Paths" : section}
          </Button>
        ))}
      </div>

      {/* Content Sections */}
      {activeSection === "courses" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative">
                <img
                  src={course.thumbnail || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <Badge className="absolute top-2 right-2 bg-white text-black">{course.price}</Badge>
                {course.progress > 0 && (
                  <div className="absolute bottom-2 left-2 right-2">
                    <Progress value={course.progress} className="h-2" />
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {course.level}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {course.category}
                  </Badge>
                </div>
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{course.description}</p>

                <div className="flex items-center gap-2 mb-3">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={course.instructorAvatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {course.instructor
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">{course.instructor}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {course.students}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {course.rating}
                  </div>
                </div>

                <div className="flex gap-1 mb-4">
                  {course.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Button className="w-full">{course.progress > 0 ? "Continue Learning" : "Start Course"}</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeSection === "tutorials" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorials.map((tutorial) => (
            <Card key={tutorial.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <div className="relative">
                <img
                  src={tutorial.thumbnail || "/placeholder.svg"}
                  alt={tutorial.title}
                  className="w-full h-32 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 left-2">
                  {tutorial.type === "video" && <Video className="h-6 w-6 text-white" />}
                  {tutorial.type === "article" && <FileText className="h-6 w-6 text-white" />}
                  {tutorial.type === "podcast" && <Headphones className="h-6 w-6 text-white" />}
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs capitalize">
                    {tutorial.type}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {tutorial.difficulty}
                  </Badge>
                </div>
                <h3 className="font-semibold mb-2 line-clamp-2">{tutorial.title}</h3>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {tutorial.duration || tutorial.readTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {tutorial.views} views
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeSection === "webinars" && (
        <div className="space-y-4">
          {webinars.map((webinar) => (
            <Card key={webinar.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        className={
                          webinar.status === "upcoming" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                        }
                      >
                        {webinar.status === "upcoming" ? "Upcoming" : "Recorded"}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{webinar.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{webinar.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>
                        {webinar.date} at {webinar.time}
                      </span>
                      <span>{webinar.attendees} attendees</span>
                      <span>by {webinar.speaker}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button className={webinar.status === "upcoming" ? "" : "bg-blue-600"}>
                      {webinar.status === "upcoming" ? "Register" : "Watch Recording"}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Resources
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeSection === "paths" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {learningPaths.map((path) => (
            <Card key={path.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  {path.icon}
                  <h3 className="font-semibold text-lg mt-2 mb-1">{path.title}</h3>
                  <p className="text-sm text-muted-foreground">{path.description}</p>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{path.progress}%</span>
                  </div>
                  <Progress value={path.progress} className="h-2" />
                </div>

                <div className="flex justify-between text-sm text-muted-foreground mb-4">
                  <span>{path.courses} courses</span>
                  <span>{path.duration}</span>
                  <Badge variant="outline" className="text-xs">
                    {path.level}
                  </Badge>
                </div>

                <Button className="w-full">{path.progress > 0 ? "Continue Path" : "Start Learning"}</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeSection === "achievements" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((achievement) => (
            <Card
              key={achievement.id}
              className={`text-center ${achievement.unlocked ? "bg-gradient-to-br from-yellow-50 to-orange-50" : "opacity-60"}`}
            >
              <CardContent className="p-6">
                <div className="text-4xl mb-3">{achievement.icon}</div>
                <h3 className="font-semibold mb-2">{achievement.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{achievement.description}</p>
                {achievement.unlocked ? (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Unlocked
                  </Badge>
                ) : (
                  <Badge variant="outline">Locked</Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
