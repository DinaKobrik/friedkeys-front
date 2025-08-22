import React, { useState, useEffect } from "react";
import ReviewCard from "./FeedbackCard";
import Pagination from "@/components/ui/Pagination";

interface UsersFeedbacksProps {
  initialReviews?: number;
  containerClassName?: string;
}

const UsersFeedbacks: React.FC<UsersFeedbacksProps> = ({
  initialReviews = 14,
  containerClassName = "",
}) => {
  const [reviews, setReviews] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage, setReviewsPerPage] = useState(14);
  const [filters, setFilters] = useState({
    /* будущие фильтры */ search: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Моки для теста
    const mockReviews = Array.from({ length: initialReviews }, (_, i) => i);
    setReviews(mockReviews);
    setLoading(false);
  }, [initialReviews]);

  // Количества отзывов
  useEffect(() => {
    const handleResize = () => {
      setReviewsPerPage(window.innerWidth < 991 ? 14 : 15);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Расчет количества страниц и пагинация
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const paginatedReviews = reviews
    .slice((currentPage - 1) * reviewsPerPage, currentPage * reviewsPerPage)
    .map((_, index) => <ReviewCard key={index} />);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document
      .querySelector(".users-feedbacks")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const applyFilters = () => {
    // Логика фильтрации
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="users-feedbacks">
      <div className={`${containerClassName}`}>
        {paginatedReviews.length > 0 ? (
          paginatedReviews
        ) : (
          <p className="text-[32px] font-usuzi-condensed text-white uppercase col-span-3 text-center">
            No reviews found.
          </p>
        )}
      </div>
      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default UsersFeedbacks;
