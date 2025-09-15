"use client";
import DoctorCard from "./DoctorCard";
import DoctorFilter from "./DoctorFilter";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Users,
  Filter,
  Stethoscope,
  MapPin,
  Star,
} from "lucide-react";
import { doctorService } from "@/services/doctor.service";
import { Doctor } from "@/types";
import Loading from "@/components/ui/loading";
import useDebounce from "@/hooks/useDebounce";
import AppPagination from "@/components/ui/AppPagination";
import { useDispatch } from "react-redux";
import { setDoctor } from "@/redux/slices/bookingSlice";

export default function DoctorList() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  // Khởi tạo từ URL params
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(search, 500);
  const [specialty, setSpecialty] = useState(
    searchParams.get("specialty") || ""
  );
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1")
  );

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const doctorsPerPage = 6;
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debouncedSearchRef = useRef(search);

  // Optimized debounce logic
  const updateSearchDebounced = useCallback(
    (newSearch: string) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      if (newSearch.trim() !== debouncedSearchRef.current) {
        setIsSearching(true);
      }

      searchTimeoutRef.current = setTimeout(() => {
        const shouldResetPage = debouncedSearchRef.current !== newSearch.trim();
        debouncedSearchRef.current = newSearch.trim();

        // Batch state updates
        if (shouldResetPage) {
          setCurrentPage(1);
        }
        setIsSearching(false);

        // Update URL
        updateURL(
          newSearch.trim(),
          specialty,
          shouldResetPage ? 1 : currentPage
        );
      }, 500);
    },
    [specialty, currentPage]
  );

  // Update URL without causing re-render
  const updateURL = useCallback(
    (searchValue: string, specialtyValue: string, page: number) => {
      const params = new URLSearchParams();
      if (searchValue) params.set("search", searchValue);
      if (specialtyValue) params.set("specialty", specialtyValue);
      if (page > 1) params.set("page", page.toString());

      const newURL = params.toString()
        ? `/doctors?${params.toString()}`
        : "/doctors";

      // Use replace to avoid history pollution
      window.history.replaceState(null, "", newURL);
    },
    []
  );

  // Effect for search input changes
  useEffect(() => {
    updateSearchDebounced(search);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [search, updateSearchDebounced]);

  // Optimized fetch doctors
  useEffect(() => {
    updateSearchDebounced(search);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [search, updateSearchDebounced]);

  // Fetch doctors
  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      const searchTerm = debouncedSearch.trim();

      console.log("Fetching doctors with", {
        page: currentPage,
        search: searchTerm,
      });

      const res = await doctorService.getPublicDoctors(
        currentPage,
        doctorsPerPage,
        searchTerm
      );

      setDoctors(res.data || []);
      setTotal(res.total || 0);

      // update URL
      updateURL(searchTerm, specialty, currentPage);
    } catch (err) {
      console.error("Failed to fetch doctors", err);
      setDoctors([]);
      setTotal(0);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, [debouncedSearch, currentPage, doctorsPerPage]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);
  const handleSearchChange = useCallback((newSearch: string) => {
    setSearch(newSearch);
    setIsSearching(true);
  }, []);

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      updateURL(debouncedSearchRef.current, specialty, page);
    },
    [specialty, updateURL]
  );

  // Handle booking
  const handleBook = useCallback(
    (doctor: Doctor) => {
      dispatch(setDoctor(doctor));
      router.push("/user/booking/step-2");
    },
    [router]
  );

  // Clear filters
  const clearFilters = useCallback(() => {
    setSearch("");
    setSpecialty("");
    setCurrentPage(1);
    debouncedSearchRef.current = "";
    setIsSearching(false);

    // Clear URL
    window.history.replaceState(null, "", "/doctors");

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  }, []);

  // Memoized calculations
  const totalPages = useMemo(
    () => Math.ceil(total / doctorsPerPage),
    [total, doctorsPerPage]
  );

  const specialties = useMemo(
    () => Array.from(new Set(doctors.map((d) => d.specialty))),
    [doctors]
  );

  // Pagination numbers
  const paginationNumbers = useMemo(() => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage <= 3) {
      for (let i = 1; i <= maxVisible; i++) {
        pages.push(i);
      }
    } else if (currentPage >= totalPages - 2) {
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        pages.push(i);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  // Show loading only for initial load
  if (loading && doctors.length === 0) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/30 py-24">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-6">
            <Stethoscope className="w-4 h-4 mr-2" />
            Đội ngũ y bác sĩ
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Bác sĩ chuyên khoa
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {" "}
              hàng đầu
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hơn 50 bác sĩ giàu kinh nghiệm, được đào tạo bài bản, sẵn sàng tư
            vấn và chăm sóc sức khỏe cho bạn
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">50+</div>
            <div className="text-gray-600">Bác sĩ chuyên khoa</div>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">4.8</div>
            <div className="text-gray-600">Đánh giá trung bình</div>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">15+</div>
            <div className="text-gray-600">Bệnh viện liên kết</div>
          </div>
        </div>

        {/* Filter */}
        <DoctorFilter
          isSearching={isSearching}
          onSearchChange={handleSearchChange}
          searchValue={search}
        />

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2 text-gray-600">
            <Filter className="w-5 h-5" />
            <span>
              Hiển thị {doctors.length} trong số {total} bác sĩ
            </span>
          </div>
          {(search || specialty) && (
            <button
              onClick={clearFilters}
              className="text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>

        {/* Doctor Grid & Empty State Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12 min-h-[450px]">
          {doctors.length > 0
            ? // Render danh sách bác sĩ nếu có
            doctors.map((doctor, index) => (
              <div
                key={doctor.id}
                className="transform transition-all duration-300 hover:-translate-y-1 animate-fade-in" // Thêm animation cho mượt
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <DoctorCard doctor={doctor} onBook={handleBook} />
              </div>
            ))
            : // Render Empty State nếu không có bác sĩ và không đang loading
            !loading &&
            !isSearching && (
              <div className="col-span-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Không tìm thấy bác sĩ
                </h3>
                <p className="text-gray-600 mb-6">
                  {debouncedSearchRef.current
                    ? `Không tìm thấy bác sĩ nào với từ khóa "${debouncedSearchRef.current}"`
                    : "Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm"}
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <AppPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
