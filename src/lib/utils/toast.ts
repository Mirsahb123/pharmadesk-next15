// Temporary placeholder for toast notifications
// Will be replaced with react-hot-toast after package installation

export const toast = {
  success: (message: string) => {
    console.log("✅ Success:", message);
    if (typeof window !== "undefined") {
      alert(message);
    }
  },
  error: (message: string) => {
    console.error("❌ Error:", message);
    if (typeof window !== "undefined") {
      alert("Error: " + message);
    }
  },
  loading: (message: string) => {
    console.log("⏳ Loading:", message);
  },
};

export default toast;
