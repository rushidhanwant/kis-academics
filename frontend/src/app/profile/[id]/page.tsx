'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, Eye, Clock, DollarSign, Mail, Loader2, Book, School, Text } from "lucide-react"
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from "react"
import { getProfile, request } from "@/sevices/tutor"
import { TutorProfile } from "../../types"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
interface TutorProfileProps {
  tutor: {
    id: number
    name: string
    subjects: string[]
    plan: string
    curriculum: string
    bio: string
    availability: string
    imageUrl: string
    views: number
    rating: number
    pricing: string
    about: string
  }
}

export default function TutorProfilePage({ }: TutorProfileProps) {

  const params = useParams<{ id: string }>();
  const [profile, setProfile] = useState<TutorProfile>();
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const router = useRouter();
  useEffect(() => {
    const fetchProfile = async (id: string) => {
      setIsLoading(true);
      try {
        const result = await getProfile(id);
        if (result) setProfile(result);
        else router.push('/');
      } catch (error) {
        console.error("Error fetching profile:", error);
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };
    if (params.id) {
      fetchProfile(params.id);
    }
  }, [params.id, router]);

  const onBack = () => {
    router.push('/')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (profile) {
      await request(profile.id, { name, message });
    }
    console.log("Submitted:", { name, message })
    setIsDialogOpen(false)
    setName("")
    setMessage("")
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
      </Button>
      <div className="flex flex-col items-center mb-8">
        <div className=" w-[15%] m-5 rounded-full overflow-hidden">
          <img src={profile.profile_picture} alt={profile.first_name} className="w-full aspect-[1/1] object-cover" />
        </div>
        <h1 className="text-3xl font-bold">{profile.first_name + " " + profile.last_name}</h1>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Tutor Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <Star className="mr-2 h-5 w-5 text-yellow-500" />
              <span className="font-medium">ATAR:</span>
              <span className="ml-2">{profile.atar} / 100</span>
            </div>
            <div className="flex items-center">
              <Eye className="mr-2 h-5 w-5" />
              <span className="font-medium">Views:</span>
              <span className="ml-2">{1000}</span>
            </div>
            <div className="flex items-center">
              <Book className="mr-2 h-5 w-5" />
              <span className="font-medium">Subjets:</span>
              <span className="ml-2">{profile.subjects.map(subject => subject.name + ` (${subject.curriculum})`).join(", ")}</span>
            </div>
            <div className="flex items-center">
              <School className="mr-2 h-5 w-5" />
              <span className="font-medium">School:</span>
              <span className="ml-2">{profile.school}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              <span className="font-medium">Availability:</span>
              <Badge
                variant={profile.available ? "secondary" : "destructive"}
                className="ml-2"
              >
                {profile.available ? "Available" : "Unavailable"}
              </Badge>
            </div>
            <div className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5" />
              <span className="font-medium">Pricing:</span>
              <span className="ml-2">{profile.price}</span>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Mail className="mr-2 h-4 w-4" /> Reach Out
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-white ">
                <DialogHeader className="flex flex-col items-center">
                  <DialogTitle>Contact {profile.first_name + " " + profile.last_name}</DialogTitle>
                  <DialogDescription>
                    Send a message to {profile.first_name + " " + profile.last_name}. They will get back to you soon.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2 ">
                    <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Your Name
                    </label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Enter your message"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">Submit</Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>About Me</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm/relaxed">{profile.bio}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}