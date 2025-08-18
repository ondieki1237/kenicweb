"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Users,
  MessageSquare,
  ThumbsUp,
  Plus,
  TrendingUp,
  Award,
  Calendar,
  MapPin,
  Star,
  Eye,
  Clock,
  Filter,
  Hash,
  UserPlus,
  Bell,
  Share2,
} from "lucide-react"

export default function CommunityHub() {
  const [activeSection, setActiveSection] = useState("discussions")
  const [newPostContent, setNewPostContent] = useState("")
  const [showNewPost, setShowNewPost] = useState(false)

  const discussions = [
    {
      id: 1,
      title: "Best practices for .co.ke domain SEO optimization",
      author: "David Kimani",
      avatar: "/customer-avatar-david.png",
      category: "SEO & Marketing",
      replies: 23,
      likes: 45,
      views: 234,
      timeAgo: "2 hours ago",
      tags: ["SEO", "Marketing", "co.ke"],
      isHot: true,
    },
    {
      id: 2,
      title: "M-Pesa integration challenges and solutions",
      author: "Grace Wanjiku",
      avatar: "/customer-avatar-grace.png",
      category: "Technical Support",
      replies: 18,
      likes: 32,
      views: 156,
      timeAgo: "5 hours ago",
      tags: ["M-Pesa", "Payment", "Integration"],
      isHot: false,
    },
    {
      id: 3,
      title: "Cybersecurity tips for .KE domain owners",
      author: "Peter Mwangi",
      avatar: "/customer-avatar-peter.png",
      category: "Security",
      replies: 41,
      likes: 78,
      views: 445,
      timeAgo: "1 day ago",
      tags: ["Security", "DNS", "Protection"],
      isHot: true,
    },
  ]

  const events = [
    {
      id: 1,
      title: "KeNIC Digital Summit 2025",
      date: "March 15, 2025",
      location: "Nairobi, Kenya",
      attendees: 250,
      type: "Conference",
      description: "Annual gathering of .KE domain stakeholders and digital innovators.",
    },
    {
      id: 2,
      title: "Domain Security Workshop",
      date: "February 28, 2025",
      location: "Virtual Event",
      attendees: 120,
      type: "Workshop",
      description: "Learn advanced security practices for domain management.",
    },
  ]

  const experts = [
    {
      id: 1,
      name: "Dr. Sarah Kiprotich",
      title: "Domain Security Expert",
      avatar: "/expert-sarah.png",
      expertise: ["DNS Security", "Cybersecurity", "Registry Operations"],
      reputation: 4.9,
      answers: 156,
      followers: 1200,
    },
    {
      id: 2,
      name: "James Ochieng",
      title: "Digital Marketing Specialist",
      avatar: "/expert-james.png",
      expertise: ["SEO", "Digital Marketing", "Brand Protection"],
      reputation: 4.8,
      answers: 203,
      followers: 980,
    },
  ]

  const categories = [
    { name: "General Discussion", count: 45, color: "bg-blue-100 text-blue-800" },
    { name: "Technical Support", count: 32, color: "bg-green-100 text-green-800" },
    { name: "SEO & Marketing", count: 28, color: "bg-purple-100 text-purple-800" },
    { name: "Security", count: 19, color: "bg-red-100 text-red-800" },
    { name: "Business Tips", count: 24, color: "bg-orange-100 text-orange-800" },
    { name: "Legal & Compliance", count: 15, color: "bg-yellow-100 text-yellow-800" },
  ]

  return (
    <div className="space-y-6">
      {/* Community Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif">Community Hub</h1>
          <p className="text-muted-foreground">Connect, learn, and grow with the .KE domain community</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowNewPost(!showNewPost)} className="bg-primary">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
          <Button variant="outline">
            <Bell className="mr-2 h-4 w-4" />
            Follow
          </Button>
        </div>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">2,450</div>
            <div className="text-sm text-muted-foreground">Active Members</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <MessageSquare className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">1,234</div>
            <div className="text-sm text-muted-foreground">Discussions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">89</div>
            <div className="text-sm text-muted-foreground">Experts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm text-muted-foreground">Events</div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b">
        {["discussions", "events", "experts", "categories"].map((section) => (
          <Button
            key={section}
            variant={activeSection === section ? "default" : "ghost"}
            onClick={() => setActiveSection(section)}
            className="capitalize"
          >
            {section}
          </Button>
        ))}
      </div>

      {/* New Post Form */}
      {showNewPost && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Discussion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Discussion title..." />
            <Textarea
              placeholder="Share your thoughts, ask questions, or start a discussion..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              rows={4}
            />
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Badge variant="outline">General</Badge>
                <Button variant="ghost" size="sm">
                  <Hash className="h-4 w-4 mr-1" />
                  Add Tags
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowNewPost(false)}>
                  Cancel
                </Button>
                <Button>Post Discussion</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Sections */}
      {activeSection === "discussions" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Discussions */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent Discussions</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-1" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Trending
                </Button>
              </div>
            </div>

            {discussions.map((discussion) => (
              <Card key={discussion.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {discussion.isHot && <Badge className="bg-red-100 text-red-800 text-xs">🔥 Hot</Badge>}
                        <Badge variant="outline" className="text-xs">
                          {discussion.category}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors">
                        {discussion.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={discussion.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {discussion.author
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span>{discussion.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {discussion.timeAgo}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {discussion.replies} replies
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          {discussion.likes} likes
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {discussion.views} views
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {discussion.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Top Contributors */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Contributors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {experts.slice(0, 3).map((expert) => (
                  <div key={expert.id} className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={expert.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {expert.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{expert.name}</p>
                      <p className="text-xs text-muted-foreground">{expert.answers} answers</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Popular Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {["SEO", "Security", "M-Pesa", "DNS", "Marketing", "Legal", "Business"].map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-white">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeSection === "events" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <Badge className="bg-blue-100 text-blue-800">{event.type}</Badge>
                  <Button variant="ghost" size="sm">
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>
                <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{event.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{event.attendees} attendees</span>
                  </div>
                </div>
                <Button className="w-full mt-4">Register Now</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeSection === "experts" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experts.map((expert) => (
            <Card key={expert.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <Avatar className="h-20 w-20 mx-auto mb-4">
                  <AvatarImage src={expert.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-lg">
                    {expert.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg mb-1">{expert.name}</h3>
                <p className="text-muted-foreground text-sm mb-3">{expert.title}</p>
                <div className="flex items-center justify-center gap-1 mb-3">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{expert.reputation}</span>
                </div>
                <div className="flex justify-center gap-4 text-sm text-muted-foreground mb-4">
                  <span>{expert.answers} answers</span>
                  <span>{expert.followers} followers</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {expert.expertise.slice(0, 2).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Follow
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeSection === "categories" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Card key={category.name} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.count} discussions</p>
                  </div>
                  <Badge className={category.color}>{category.count}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
