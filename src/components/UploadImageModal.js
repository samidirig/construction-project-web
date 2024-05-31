import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Stack,
  Avatar,
} from "@mui/material";
import {
  uploadImage,
  updateVisorCompanyProfileImage,
  updateVisorUserProfileImage,
  updateCompanyProfileImage,
  updateUserProfileImage,
  updateWorksiteProfileImage,
  updateProjectProfileImage,
} from "../config/firebase"; // Az önce yazdığımız işlevler

export default function UploadImageModal({ isOpen, onClose, type, id }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      setLoading(true);
      try {
        const path = `images/${id}/${file.name}`;
        const imageUrl = await uploadImage(file, path);
        if (type === "visorCompany") {
          await updateVisorCompanyProfileImage(id, imageUrl);
        } else if (type === "visorUser") {
          await updateVisorUserProfileImage(id, imageUrl);
        } else if (type === "company") {
          await updateCompanyProfileImage(id, imageUrl);
        } else if (type === "user") {
          await updateUserProfileImage(id, imageUrl);
        } else if (type === "project") {
          await updateProjectProfileImage(id, imageUrl);
        } else if (type === "worksite") {
          await updateWorksiteProfileImage(id, imageUrl);
        }
        onClose();
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>
        {type === "company"
          ? "Firma Fotoğraf Güncelle"
          : "Yönetici Fotoğraf Güncelle"}
      </DialogTitle>
      <DialogContent>
        <input type="file" onChange={handleFileChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          İptal
        </Button>
        <Button onClick={handleUpload} color="primary" disabled={loading}>
          {loading ? "Yükleniyor..." : "Yükle"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
