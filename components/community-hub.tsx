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

      <div className="mt-10 flex flex-col items-center gap-2">
        <span className="font-semibold text-lg">Join Our Community</span>
        <div className="flex gap-4 mt-2">
          <a
            href="https://www.linkedin.com/company/kenic-tld/?originalSubdomain=ke"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-blue-700 transition"
          >
            <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 10.268h-3v-4.604c0-1.098-.021-2.507-1.527-2.507-1.528 0-1.763 1.195-1.763 2.428v4.683h-3v-9h2.881v1.233h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.599v4.731z"/></svg>
          </a>
          <a
            href="https://x.com/KenicTLD"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (Twitter)"
            className="hover:text-black transition"
          >
            <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M22.162 0h-20.324c-.997 0-1.838.841-1.838 1.838v20.324c0 .997.841 1.838 1.838 1.838h20.324c.997 0 1.838-.841 1.838-1.838v-20.324c0-.997-.841-1.838-1.838-1.838zm-5.707 7.548l-2.453 3.37 2.453 3.37h-1.453l-1.727-2.37-1.727 2.37h-1.453l2.453-3.37-2.453-3.37h1.453l1.727 2.37 1.727-2.37h1.453zm-7.455 0h1.5v6.74h-1.5v-6.74zm.75-2.25c.483 0 .875.392.875.875s-.392.875-.875.875-.875-.392-.875-.875.392-.875.875-.875zm10.455 15.202c0 .276-.224.5-.5.5h-16c-.276 0-.5-.224-.5-.5v-16c0-.276.224-.5.5-.5h16c.276 0 .5.224.5.5v16z"/></svg>
          </a>
          <a
            href="https://www.instagram.com/kenictld/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:text-pink-600 transition"
          >
            <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.975-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.974-1.246-2.241-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.975 2.241-1.246 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.012-4.947.07-1.276.058-2.687.334-3.678 1.325-.991.991-1.267 2.402-1.325 3.678-.058 1.28-.07 1.688-.07 4.947s.012 3.667.07 4.947c.058 1.276.334 2.687 1.325 3.678.991.991 2.402 1.267 3.678 1.325 1.28.058 1.688.07 4.947.07s3.667-.012 4.947-.07c1.276-.058 2.687-.334 3.678-1.325.991-.991 1.267-2.402 1.325-3.678.058-1.28.07-1.688.07-4.947s-.012-3.667-.07-4.947c-.058-1.276-.334-2.687-1.325-3.678-.991-.991-2.402-1.267-3.678-1.325-1.28-.058-1.688-.07-4.947-.07zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
          </a>
          <a
            href="https://www.youtube.com/channel/UCfpfyvDcBZn5YLP7hj1z2Ug?app=desktop"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="hover:text-red-600 transition"
          >
            <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a2.997 2.997 0 0 0-2.112-2.112C19.6 3.5 12 3.5 12 3.5s-7.6 0-9.386.574a2.997 2.997 0 0 0-2.112 2.112C0 7.972 0 12 0 12s0 4.028.502 5.814a2.997 2.997 0 0 0 2.112 2.112C4.4 20.5 12 20.5 12 20.5s7.6 0 9.386-.574a2.997 2.997 0 0 0 2.112-2.112C24 16.028 24 12 24 12s0-4.028-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          </a>
          <a
            href="https://web.facebook.com/Kenictld/?_rdc=1&_rdr#"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="hover:text-blue-600 transition"
          >
            <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.326 24H12.82v-9.294H9.692v-3.622h3.127V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.325-.592 1.325-1.326V1.326C24 .592 23.405 0 22.675 0"/></svg>
          </a>
        </div>
      </div>
    </div>
  )
}
