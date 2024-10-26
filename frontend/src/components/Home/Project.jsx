
import React, { useContext, useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Plus } from "lucide-react"
import axios from 'axios'
import backend from '../../../backend'
import { useParams } from 'react-router-dom'
import { Authcontext } from '../AuthProvider'

// Mock data for projects

export default function Project({ classroomName }) {
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [projects, setProjects] = useState([])
  const {classId}=useParams();
  const token=localStorage.getItem("token");
  const value=useContext(Authcontext);

  //create project
  async function handleCreateProject(){
    await axios.post(`${backend}/room/project/create`,{
        name:newProjectName,
        classId
    },{
        headers:{
            Authorization:token
        }
    }).then(res=>{
        console.log(res.data.project);
        setNewProjectName('')
        setIsCreateProjectModalOpen(false)
    }).catch(err=>{
        console.log(err);
        
    })}

    
    //fetch all projects
    async function FetchProjects(){
        
        await axios.get(`${backend}/room/class/${classId}`,{
            headers:{
                Authorization:token
            }
        }).then(res=>{
            setProjects(res.data.projects)
                   
        }).catch(err=>{
            console.log(err);
            
        })
    }
  useEffect(()=>{
    FetchProjects();
  },[])

  // Check if value is available
  if (!value || !value.id) {
    return <div>Loading...</div>; // Render a loading state or a message
  }
  

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">{classroomName}</h2>
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <Input type="text" placeholder="Search Projects" className="pl-10 bg-white" />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <Button className="bg-black text-white hover:bg-gray-800" onClick={() => setIsCreateProjectModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create a Project
        </Button>
      </div>
      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="bg-white">
          <TabsTrigger value="all" className="data-[state=active]:bg-gray-100">All Projects</TabsTrigger>
          <TabsTrigger value="my" className="data-[state=active]:bg-gray-100">My Projects</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id} className="bg-white shadow-sm">
                <CardContent className="p-4">
                <h3 className="text-xl font-semibold">{project.name}</h3>
                  <p className="text-sm text-gray-500">Created by: {project.user.name}</p>
                  <p className="text-sm text-gray-500">Email: {project.user.email}</p>
                  <p className="text-sm text-gray-500">Class Name: {project.class.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="my">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Filter projects to show only the current user's projects */}
            {projects.filter(project => project.user.id === value.id).map((project) => (
              <Card key={project.id} className="bg-white shadow-sm">
                <CardContent className="p-4">
                  <h3 className="text-xl font-semibold">{project.name}</h3>
                  <p className="text-sm text-gray-500">Created by: {project.user.name}</p>
                  <p className="text-sm text-gray-500">Email: {project.user.email}</p>
                  <p className="text-sm text-gray-500">Class Name: {project.class.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Project Modal */}
      <Dialog open={isCreateProjectModalOpen} onOpenChange={setIsCreateProjectModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create a Project</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="projectName" className="col-span-4">
                Project Name
              </Label>
              <Input 
                id="projectName" 
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Enter Project Name" 
                className="col-span-4" 
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsCreateProjectModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateProject} disabled={!newProjectName.trim()} className="bg-black text-white hover:bg-gray-800">Create</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}