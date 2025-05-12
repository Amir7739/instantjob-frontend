import axiosInstance from "@/utils/axios"
import { AxiosResponse } from "axios"
import { Education, Experience } from "./candidates"

export interface CandidateJob {
    id: number
    title: string
    company: string
    location: string
    salary: string
    posted: string
    tags: string[]
    matchScore?: number
    savedAt?: string
  }

  export interface Project {
  _id?: string;
  projectName: string;
  description: string;
  startDate: string;
  endDate?: string | null;
  currentlyWorking: boolean;
  technologies: string[];
  link?: string;
}

  interface SavedJobResponse {
    jobs: CandidateJob[];
    totalJobs: number;
    currentPage: number;
    totalPages: number;
  }

  interface CandidateStats {
    jobsApplied: number;
    savedJobs: number;
    profileStrength: number;
    jobsAppliedPercentageChange: string;
    savedJobsPercentageChange: string;
  }


  export interface Candidate {
    _id: string;
    full_name: string;
    email: string;
    phone: string;
    city: string;
    state: string;
    about?: string;
    profileImage?: string;
    skills: string[];
    resumeUrl?: string | null;
  dob?: string;
  education?: Education[];
  expectedSalary?: string;
  experience: Experience[];
  gender?: string;
  noticePeriod?: string;
  pincode?: string;
  preferredJobType?: string;
  preferredLocation?: string;
  totalExperience?: string;
  status?: string;
  projects?: Project[];
  }

  export const getSavedJobsByCandidateId = async (candidateId: string, page: number = 1, limit: number = 9): Promise<SavedJobResponse> =>{
    try {

    const response = await axiosInstance.get(`/candidate-dashboard/saved-job/${candidateId}?page=${page}?limit=${limit}`);
    return response.data
        
    } catch (error) {
        console.error("Error fetching saved jobs:", error.message);
        throw error;
    }
  }


  export const getAppliedJobsByCandidateId = async (candidateId: string, page: number = 1, limit: number = 9): Promise<SavedJobResponse> =>{
    try {

    const response = await axiosInstance.get(`/candidate-dashboard/applied-job/${candidateId}?page=${page}?limit=${limit}`);
    return response.data
        
    } catch (error) {
        console.error("Error fetching applied jobs:", error.message);
        throw error;
    }
  }


  export const getCandidateStats = async (candidateId: string): Promise<CandidateStats> => {
    try {
      const response = await axiosInstance.get(`/candidate-dashboard/candidate-stats/${candidateId}`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching candidate stats:", error.message);
      throw error;
    }
  };


  export const updateCandidateProfile = async (
    candidateId: string,
    profileData: {
      full_name: string;
      email: string;
      phone: string;
      city: string;
      about: string;
      skills: string[];
      profileImage?: File | null;
    }
  ): Promise<Candidate> => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("full_name", profileData.full_name);
      formDataToSend.append("email", profileData.email);
      formDataToSend.append("phone", profileData.phone);
      formDataToSend.append("city", profileData.city);
      formDataToSend.append("about", profileData.about);
      profileData.skills.forEach((skill, index) => {
        if (skill.trim()) formDataToSend.append(`skills[${index}]`, skill);
      });
      if (profileData.profileImage) {
        formDataToSend.append("profileImage", profileData.profileImage);
      }
  
      const response: AxiosResponse<{ candidate: Candidate }> = await axiosInstance.put(
        `/candidates/update/${candidateId}`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
  
      return response.data.candidate;
    } catch (error: any) {
      console.error("Error updating candidate profile:", error);
      throw new Error(error.response?.data?.error || "Failed to update profile");
    }
  };



  export const updateCandidateExperience = async (
    candidateId: string,
    experiences: Experience[]
  ): Promise<Candidate> => {
    try {
      const formDataToSend = new FormData();
      experiences.forEach((exp, index) => {
        formDataToSend.append(`experience[${index}][companyName]`, exp.companyName);
        formDataToSend.append(`experience[${index}][jobTitle]`, exp.jobTitle);
        formDataToSend.append(`experience[${index}][startDate]`, exp.startDate);
        if (exp.location) {
          formDataToSend.append(`experience[${index}][location]`, exp.location);
        }
        if (exp.endDate) {
          formDataToSend.append(`experience[${index}][endDate]`, exp.endDate);
        }
        formDataToSend.append(`experience[${index}][currentlyWorking]`, String(exp.currentlyWorking));
        formDataToSend.append(`experience[${index}][description]`, exp.description);
        if (exp._id) {
          formDataToSend.append(`experience[${index}][_id]`, exp._id);
        }
      });
  
      const response: AxiosResponse<{ candidate: Candidate }> = await axiosInstance.put(
        `/candidates/update/${candidateId}`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
  
      return response.data.candidate;
    } catch (error: any) {
      console.error("Error updating candidate experience:", error);
      throw new Error(error.response?.data?.error || "Failed to update experience");
    }
  };


  export const updateCandidateEducation = async (
    candidateId: string,
    educations: Education[]
  ): Promise<Candidate> => {
    try {
      const formDataToSend = new FormData();
      educations.forEach((edu, index) => {
        formDataToSend.append(`education[${index}][degree]`, edu.degree);
        formDataToSend.append(`education[${index}][stream]`, edu.stream);
        formDataToSend.append(`education[${index}][institute]`, edu.institute);
        formDataToSend.append(`education[${index}][passingYear]`, edu.passingYear.toString());
        formDataToSend.append(`education[${index}][score]`, edu.score);
        if (edu._id) {
          formDataToSend.append(`education[${index}][_id]`, edu._id);
        }
      });
  
      const response: AxiosResponse<{ candidate: Candidate }> = await axiosInstance.put(
        `/candidates/update/${candidateId}`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
  
      return response.data.candidate;
    } catch (error: any) {
      console.error("Error updating candidate education:", error);
      throw new Error(error.response?.data?.error || "Failed to update education");
    }
  };

  export const updateCandidateProjects = async (
  candidateId: string,
  projects: Project[]
): Promise<Candidate> => {
  try {
    const formDataToSend = new FormData();
    projects.forEach((project, index) => {
      formDataToSend.append(`projects[${index}][projectName]`, project.projectName);
      formDataToSend.append(`projects[${index}][description]`, project.description);
      formDataToSend.append(`projects[${index}][startDate]`, project.startDate);
      if (project.endDate) {
        formDataToSend.append(`projects[${index}][endDate]`, project.endDate);
      }
      formDataToSend.append(
        `projects[${index}][currentlyWorking]`,
        String(project.currentlyWorking)
      );
      project.technologies.forEach((tech, techIndex) => {
        formDataToSend.append(`projects[${index}][technologies][${techIndex}]`, tech);
      });
      if (project.link) {
        formDataToSend.append(`projects[${index}][link]`, project.link);
      }
      if (project._id) {
        formDataToSend.append(`projects[${index}][_id]`, project._id);
      }
    });

    const response: AxiosResponse<{ candidate: Candidate }> = await axiosInstance.put(
      `/candidates/update/${candidateId}`,
      formDataToSend,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data.candidate;
  } catch (error: any) {
    console.error("Error updating candidate projects:", error);
    throw new Error(error.response?.data?.error || "Failed to update projects");
  }
};

  export const updateCandidatePassword = async (
    candidateId: string,
    passwordData: {
      newPassword: string;
      confirmNewPassword: string;
    }
  ): Promise<{ message: string }> => {
    try {
      const response = await axiosInstance.put(`/auth/update-pass/${candidateId}`, passwordData);
      return response.data;
    } catch (error: any) {
      console.error("Error updating password:", error);
      throw new Error(error.response?.data?.message || "Failed to update password");
    }
  };


  interface ProfileTasksResponse {
  profileTasks: { id: number; task: string; completed: boolean }[];
  completedTasks: number;
  totalTasks: number;
  completionPercentage: number;
}

export const getProfileTasks = async (
  candidateId: string
): Promise<ProfileTasksResponse> => {
  try {
    const response: AxiosResponse<ProfileTasksResponse> = await axiosInstance.get(
      `/candidate-dashboard/profile-tasks/${candidateId}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching profile tasks:", error.message);
    throw new Error(
      error.response?.data?.message || "Failed to fetch profile tasks"
    );
  }
};