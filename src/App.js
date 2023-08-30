// Store data in localStorage
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";

const MyApp = () => {
  const [userDataArray, setUserDataArray] = useState([]); // State to store user data
  const [isLoading, setIsLoading] = useState(true); // State to track loading status

  useEffect(() => {
    loadUserData(); // Load user data when the component mounts
  }, []);

  // Function to load user data
  const loadUserData = async () => {
    try {
      setIsLoading(true); // Set loading to true

      // Check if stored data exists in local storage
      const storedUserData = JSON.parse(localStorage.getItem("uniqueUserData"));
      if (storedUserData) {
        setUserDataArray(storedUserData); // Use stored data if available
        setIsLoading(false); // Loading done
      } else {
        await fetchDataFromApi(); // Fetch data from API if not available
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setIsLoading(false); // Loading done (with error)
    }
  };

  // Function to fetch data from API
  const fetchDataFromApi = async () => {
    try {
      const response = await axios.get("https://randomuser.me/api/?results=50");
      const newUserData = response.data.results;
      setIsLoading(false); // Loading done
      setUserDataArray(newUserData);

      // Store fetched data in local storage
      localStorage.setItem("uniqueUserData", JSON.stringify(newUserData));
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false); // Loading done (with error)
    }
  };

  // Function to handle user deletion
  const handleDeleteUser = (uuid) => {
    const updatedUserData = userDataArray.filter(
      (user) => user.login.uuid !== uuid
    );
    setUserDataArray(updatedUserData);
    localStorage.setItem("uniqueUserData", JSON.stringify(updatedUserData));
  };

  // Function to refresh user data from the API
  const handleRefresh = async () => {
    setIsLoading(true); // Set loading to true
    await fetchDataFromApi(); // Fetch data from the API
  };

  return (
    <div>
      <div>
        <Button variant="contained" onClick={handleRefresh} color="success">
          Refresh Data
        </Button>
      </div>
      {isLoading ? (
        <CircularProgress /> // Show loading spinner while loading
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            Displaying {userDataArray.length} Users
          </Typography>
          {userDataArray.map((user) => (
            <Card key={user.login.uuid} sx={{ maxWidth: 345, margin: "1rem" }}>
              <CardContent>
                <img src={user.picture.large} alt="Profile" />
                <Typography variant="h6">{`${user.name.first} ${user.name.last}`}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleDeleteUser(user.login.uuid)}
                >
                  Delete User
                </Button>
              </CardActions>
            </Card>
          ))}
        </>
      )}
    </div>
  );
};

export default MyApp;
