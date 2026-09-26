package com.flowershop.config;

import com.flowershop.model.Product;
import com.flowershop.model.Review;
import com.flowershop.model.User;
import com.flowershop.repository.ProductRepository;
import com.flowershop.repository.ReviewRepository;
import com.flowershop.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(ProductRepository productRepository,
                                       ReviewRepository reviewRepository,
                                       UserRepository userRepository) {
        return args -> {
            if (productRepository.count() == 0) {
                List<Product> sampleProducts = List.of(
                    new Product("White Rose Bouquet", 12.99, 15.99, "-10%", "image/25.jpg", "Bouquets", 4.8),
                    new Product("Pink Rose Gift Wrap", 10.89, 15.99, "-15%", "image/13.jpg", "Gift Wraps", 4.9),
                    new Product("Potted Pink Roses", 11.00, 15.99, "-5%", "image/14.jpg", "Potted Plants", 4.7),
                    new Product("Blush Pink Rose Bundle", 13.79, 15.99, "-20%", "image/15.jpg", "Bundles", 4.6),
                    new Product("Red Rose Hand-Tied Bouquet", 14.32, 15.99, "-3%", "image/16.jpg", "Hand-Tied", 5.0),
                    new Product("White Tulip Bouquet", 10.99, 15.99, "-21%", "image/17.jpg", "Tulips", 4.8),
                    new Product("Pink Rose Bouquet", 12.69, 15.99, "-18%", "image/18.jpg", "Bouquets", 4.9),
                    new Product("Purple Daisy Bouquet", 2.99, 15.99, "-30%", "image/19.jpg", "Daisies", 4.5),
                    new Product("Purple Hydrangea Bouquet", 13.66, 15.99, "-10%", "image/21.jpg", "Hydrangeas", 4.9)
                );
                productRepository.saveAll(sampleProducts);
                System.out.println("🌸 Seeded " + sampleProducts.size() + " sample products into Spring Boot DB.");
            }

            if (reviewRepository.count() == 0) {
                List<Review> sampleReviews = List.of(
                    new Review("john deo", "happy customer", "Great service and beautiful flowers. The order process was easy and the delivery was on time.", 5, "image/31.jpg", System.currentTimeMillis() - 86400000),
                    new Review("Lisa", "happy customer", "This flower shop has amazing quality flowers. The delivery was very fast and the flowers were fresh and beautiful. I will definitely order again!", 5, "image/32.jpg", System.currentTimeMillis() - 43200000),
                    new Review("Roy", "happy customer", "I bought flowers for my friend's birthday and they looked wonderful. The packaging was nice and the service was great. Highly recommended!", 5, "image/33.jpg", System.currentTimeMillis() - 21600000)
                );
                reviewRepository.saveAll(sampleReviews);
                System.out.println("🌸 Seeded " + sampleReviews.size() + " sample reviews into Spring Boot DB.");
            }

            if (userRepository.count() == 0) {
                User demoUser = new User("Shivam", "shivamgill9322@gmail.com", "password123");
                userRepository.save(demoUser);
                System.out.println("🌸 Seeded default demo user into Spring Boot DB.");
            }
        };
    }
}
