"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar } from "@radix-ui/themes";
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { search } from "@/sevices/tutor"
import { Curriculum, TutorPricing, TutorSortOrder } from "@/sevices/types"
import { useRouter } from "next/navigation"
import { Tutor } from "./types"
import { curriculums, pricing, schools, subjects } from "@/utils/constants"
import { clipBio } from "@/utils/helper"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function TutorSearch() {
  const router = useRouter();
  const [currentTutors, setTutor] = useState<Tutor[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sort, setSort] = useState<TutorSortOrder>(TutorSortOrder.created_desc);
  const [searchTerm, setSearchTerm] = useState('');
  const [price, setSelectedPlan] = useState<TutorPricing>();
  const [curriculum, setSelectedCurriculum]  =  useState<Curriculum>();
  const [selectedSubjects, setSelectedSubjects]  =  useState<string[]>([]);
  const [pageNumbers, setPageNumbers] = useState<number[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<string>();
  const [showFilters, setShowFilters] = useState(true)
  useEffect(() => {
    const fetchTutors = async () => {
      const result = await search({
        page: currentPage,
        sort,
        query: searchTerm,
        price,
        curriculum,
        subject: encodeURIComponent(JSON.stringify(selectedSubjects)) ,
        school: selectedSchool,
      });
      if (result) {
        setTutor(result.tutors);
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(result.totalPages); i++) {
          pageNumbers.push(i)
        }
        setPageNumbers(pageNumbers)
      }
    };
    fetchTutors();
  }, [searchTerm, price, curriculum, selectedSubjects, selectedSchool, sort, currentPage]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedPlan('' as TutorPricing);
    setSelectedCurriculum('' as Curriculum);
    setSelectedSubjects([]);
    setSelectedSchool('');
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">KIS ACADEMICS</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/5 md:sticky md:top-4 md:self-start z-10">
          <Input
            type="text"
            placeholder="Search tutors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4 bg-white"
          />
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Filters</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="w-9 p-0"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                <span className="sr-only">{showFilters ? "Hide filters" : "Show filters"}</span>
              </Button>
            </CardHeader>
            {showFilters && (<CardContent>
              <div className="space-y-4">
              <Card className="rounded-md shadow-none">
                    <CardContent className="p-0">
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="subjects">
                          <AccordionTrigger className="px-4 py-2">Subjects</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2 p-4">
                              {subjects.map(
                                (subject) => (
                                  <div key={subject} className="flex items-center">
                                    <Checkbox
                                      id={subject}
                                      checked={selectedSubjects.includes(subject)}
                                      onCheckedChange={(checked) => {
                                        setSelectedSubjects(
                                          checked
                                            ? [...selectedSubjects, subject]
                                            : selectedSubjects.filter((s) => s !== subject)
                                        )
                                      }}
                                    />
                                    <label htmlFor={subject} className="ml-2 text-sm font-medium">
                                      {subject}
                                    </label>
                                  </div>
                                )
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                <div>
                  <h3 className="font-medium mb-2">Plan</h3>
                  <Select value={price} onValueChange={(value: string) => setSelectedPlan(value as TutorPricing)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {pricing.map((plan: string) => (
                        <SelectItem key={plan} value={plan}>{plan}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Curriculum</h3>
                  <Select value={curriculum} onValueChange={(value: string) => setSelectedCurriculum(value as Curriculum)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a curriculum" />
                    </SelectTrigger>
                    <SelectContent>
                      {curriculums.map((curriculum: string) => (
                        <SelectItem key={curriculum} value={curriculum}>{curriculum}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <h3 className="font-medium mb-2">School</h3>
                  <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a school" />
                    </SelectTrigger>
                    <SelectContent>
                      {schools.map((school: string) => (
                        <SelectItem key={school} value={school}>{school}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Button 
                    onClick={clearAllFilters} 
                    variant="outline" 
                    className="w-full my-6 bg-black text-white hover:bg-gray-800 hover:text-white"
                  >
                    Clear All Filters
                  </Button>
                </div>
              </div>
            </CardContent>)}
          </Card>
        </div>
        <div className="w-full md:w-4/5">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 md:grid-cols-2">
            {currentTutors.length === 0 ? (
              <div className="col-span-full text-center">
                <h3 className="text-lg font-semibold mb-2">No tutors found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or filters to find more tutors.
                </p>
              </div>
            ) : (
              currentTutors.map((tutor) => (
                <Card key={tutor.id} onClick={() => router.push(`/profile/${tutor.id}`)}>
                  <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className=" w-[20%] rounded-full overflow-hidden">
                      <img src={tutor.profile_picture} alt={tutor.first_name} className="w-full aspect-[1/1] object-cover" />
                    </div>
                    
                    <div className="w-[80%]">
                      <h3 className="text-lg font-semibold">{tutor.first_name + " " + tutor.last_name}</h3>
                      <p className="text-sm text-gray-500">{tutor.subjects.map((subject) => subject.name).join(", ")}</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm">{clipBio(tutor.bio)}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{tutor.price}</Badge>
                      <Badge variant="secondary">{tutor.school}</Badge>
                      <Badge variant="secondary">ATAR {tutor.atar}</Badge>
                      <Badge
                        variant={tutor.available ? "secondary" : "destructive"}
                      >
                        {tutor.available ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )))}
          </div>
          <div className="mt-6 flex justify-center">
            <nav className="inline-flex overflow-x-auto">
              {pageNumbers.map((number) => (
                <Button
                  key={number}
                  variant={currentPage === number ? "default" : "outline"}
                  className="mx-1"
                  onClick={() => setCurrentPage(number)}
                >
                  {number}
                </Button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}