"use server";

import { revalidatePath } from "next/cache";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

// =========================================================================
// FETCH ALL USERS
// =========================================================================
export const getAllUser = async () => {
  try {
    const res = await fetch(`${SERVER_URL}/api/all-users`, {
      cache: "no-store", 
    });

    if (!res.ok) {
      throw new Error(`Server returned a ${res.status} error code.`);
    }

    return await res.json();
  } catch (error) {
    console.error("Action [getAllUser] Error:", error.message);
    return []; 
  }
};

// =========================================================================
// CREATE NEW USER
// =========================================================================
export const addUser = async (userData) => {
  try {
    const res = await fetch(`${SERVER_URL}/api/admin/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      const errorResponse = await res.json().catch(() => ({}));
      throw new Error(errorResponse.error || `Request failed with code: ${res.status}`);
    }

    revalidatePath("/dashboard/admin/manage-users");
    return await res.json();
  } catch (error) {
    console.error("Action [addUser] Error:", error.message);
    throw error; 
  }
};

// =========================================================================
// FIXED: TOGGLE BLOCK STATUS (Passing explicit boolean flag to Express)
// =========================================================================
export const toggleBlockUser = async (userId, isBlocked) => {
  try {
    const res = await fetch(`${SERVER_URL}/api/admin/users/${userId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currentStatus: isBlocked }), 
    });

    if (!res.ok) {
      const errorResponse = await res.json().catch(() => ({}));
      throw new Error(errorResponse.error || `Status patch failed with code: ${res.status}`);
    }

    revalidatePath("/dashboard/admin/manage-users");
    return await res.json();
  } catch (error) {
    console.error("Action [toggleBlockUser] Error:", error.message);
    throw error;
  }
};

// =========================================================================
// DELETE USER
// =========================================================================
export const deleteUser = async (userId) => {
  try {
    const res = await fetch(`${SERVER_URL}/api/admin/users/${userId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorResponse = await res.json().catch(() => ({}));
      throw new Error(errorResponse.error || `Deletion request rejected with code: ${res.status}`);
    }

    revalidatePath("/dashboard/admin/manage-users");
    return await res.json();
  } catch (error) {
    console.error("Action [deleteUser] Error:", error.message);
    throw error;
  }
};

// =========================================================================
// 🌟 ADDED: UPDATE USER DETAILS (Name and Role)
// =========================================================================
export const updateUser = async (userId, updateData) => {
  try {
    const res = await fetch(`${SERVER_URL}/api/admin/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData), // Expecting { name, role }
    });

    if (!res.ok) {
      const errorResponse = await res.json().catch(() => ({}));
      throw new Error(errorResponse.error || `Update failed with code: ${res.status}`);
    }

    revalidatePath("/dashboard/admin/manage-users");
    return await res.json();
  } catch (error) {
    console.error("Action [updateUser] Error:", error.message);
    throw error;
  }
};