import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Define TypeScript interfaces
interface TrainingModule {
  _id: string;
  status: string;
  title: string;
  description: string;
  imgUrl: string;
  chapters: string[];
  assignments: string[];
  questions: string[];
  instructorId: string;
  order: number;
  category: string;
  updatedAt: string;
  moduleCompletionPercentage: number;
}

interface UserProgress {
  _id: string;
  userId: string;
  allowedModules: TrainingModule[];
  completedModules: TrainingModule[];
  moduleProgress: TrainingModule[];
}

interface Training {
  id: string;
  title: string;
  image: string;
  progress: number;
  dueDate: string;
  status: string;
}

const TrainingCard = ({ training }: { training: Training }) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/training/${training.id}`)}
    >
      <img
        src={training.image}
        alt={training.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {training.title}
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{training.progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${training.progress}%` }}
              ></div>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Due: {training.dueDate}</span>
            <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              {training.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmployeeDashboard = () => {
  const token = useSelector((state: any) => state.auth.token); // Get token from Redux store
  const user = useSelector((state: any) => state.auth.user); // Get user data
  const username = user?.username || "User"; // Default to "User" if undefined
  const dispatch = useDispatch();
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [assignedTrainings, setAssignedTrainings] = useState<Training[]>([]);
  const navigate = useNavigate();

  // Fetch User Progress Data
  useEffect(() => {
    if (!token) {
      alert("You are not logged in. Please log in to continue.");
      return; // Stop execution if no token
    }

    fetch("http://localhost:4000/api/user-progress", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("No module has been assigned to this user.");
        }
        return res.json();
      })
      .then((data: UserProgress) => {
        console.log("this is user progress", data);

        setUserProgress(data);

        const formattedTrainings = data.allowedModules
          .filter((module) => module._id && module.status === "published")
          .map((module) => ({
            id: module._id,
            title: module.title,
            image: module.imgUrl,
            progress: module.moduleCompletionPercentage || 0,
            dueDate: "2024-04-15",
            status:
              module.moduleCompletionPercentage === 100
                ? "Completed"
                : "In Progress",
          }));

        setAssignedTrainings(formattedTrainings);
      })
      .catch((error) => {
        console.error("Error fetching user progress:", error);
        alert(error.message);
      });
  }, [token]);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back, {username}!
        </h1>
        <p className="text-gray-500 mt-1">
          Track your learning progress and upcoming training sessions
        </p>
      </div>

      {/* Training Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignedTrainings.length > 0 ? (
          assignedTrainings.map((training) => (
            <TrainingCard key={training.id} training={training} />
          ))
        ) : (
          <p className="text-gray-600">No assigned training modules.</p>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
