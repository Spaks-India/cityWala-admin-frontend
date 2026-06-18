// src/utils/crudActions.js

import API from "../api/axios";

// DELETE
export const handleDelete = async ({
  id,
  route,
  loadData,
  message = "Delete this Field?",
}) => {
  if (!window.confirm(message)) return;

  try {
    await API.delete(`/${route}/${id}`);

    alert("Deleted successfully");

    if (loadData) {
      loadData();
    }
  } catch (err) {
    alert(err.response?.data?.message || "Delete failed");
    
  }
};

// UPDATE
// export const handleUpdate = async ({
//   id,
//   route,
//   data,
//   loadData,
//   successMessage = "Updated successfully",
// }) => {
//   try {
//     await API.put(`/${route}/${id}`, data);

//     alert(successMessage);
//     setFormData({}); // Clear form after successful update
//     if (loadData) {
//       loadData();
//     }
//   } catch (err) {
//     alert(err.response?.data?.message || "Update failed");
//   }
// };

export const handleUpdate = async ({
  id = "",
  route,
  data,
  loadData,
  successMessage = "Updated successfully",
  onSuccess, // optional custom callback
}) => {
  try {
    await API.put(`/${route}${id ? `/${id}` : ""}`, data);

    alert(successMessage);

    if (onSuccess) onSuccess();

    if (loadData) {
      loadData();
    }
  } catch (err) {
    alert(err.response?.data?.message || "Update failed");
  }
};