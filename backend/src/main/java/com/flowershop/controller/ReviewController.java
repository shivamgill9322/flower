package com.flowershop.controller;

import com.flowershop.model.Review;
import com.flowershop.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(originPatterns = "*")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @GetMapping
    public List<Review> getAllReviews() {
        return reviewRepository.findAllByOrderByIdDesc();
    }

    @PostMapping
    public Review createReview(@RequestBody Review review) {
        if (review.getTimestamp() == null) {
            review.setTimestamp(System.currentTimeMillis());
        }
        if (review.getRating() == null) {
            review.setRating(5);
        }
        return reviewRepository.save(review);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Review> updateReview(@PathVariable Long id, @RequestBody Review reviewDetails) {
        return reviewRepository.findById(id).map(existing -> {
            existing.setName(reviewDetails.getName());
            existing.setEmail(reviewDetails.getEmail());
            existing.setMessage(reviewDetails.getMessage());
            existing.setRating(reviewDetails.getRating());
            if (reviewDetails.getAvatar() != null) {
                existing.setAvatar(reviewDetails.getAvatar());
            }
            return ResponseEntity.ok(reviewRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        if (reviewRepository.existsById(id)) {
            reviewRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
