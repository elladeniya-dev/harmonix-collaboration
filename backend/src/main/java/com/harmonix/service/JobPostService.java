package com.harmonix.service;

import com.harmonix.model.JobPost;
import com.harmonix.repository.JobPostRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class JobPostService {

    private final JobPostRepository repo;

    public JobPostService(JobPostRepository repo) {
        this.repo = repo;
    }

    public JobPost createJobWithExtras(String userId, String title, String description, String skillsNeeded,
                                       String collaborationType, String availability,
                                       String contactMethod, String imageUrl) {
        JobPost post = new JobPost();
        post.setUserId(userId);
        post.setTitle(title);
        post.setDescription(description);
        post.setSkillsNeeded(skillsNeeded);
        post.setCollaborationType(collaborationType);
        post.setAvailability(availability);
        post.setContactMethod(contactMethod);
        post.setImageUrl(imageUrl);
        post.setPostedAt(LocalDateTime.now());
        return repo.save(post);
    }

    public List<JobPost> getAllJobs() {
        return repo.findAll();
    }

    public JobPost getJob(String id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
    }

    public JobPost updateJob(String id, JobPost updatedJob) {
        JobPost existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));

        existing.setTitle(updatedJob.getTitle());
        existing.setDescription(updatedJob.getDescription());
        existing.setSkillsNeeded(updatedJob.getSkillsNeeded());
        existing.setCollaborationType(updatedJob.getCollaborationType());
        existing.setAvailability(updatedJob.getAvailability());
        existing.setImageUrl(updatedJob.getImageUrl());
        existing.setContactMethod(updatedJob.getContactMethod());
        existing.setPostedAt(LocalDateTime.now());

        return repo.save(existing);
    }
}
