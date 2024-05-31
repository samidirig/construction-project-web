import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import Background1 from "../assets/images/project_background.PNG";
import { useWindowSizeWidth } from "../config/hooks";
import {
  getVisorCompanyByManagerId,
  getVisorCompanies,
} from "../config/firebase";
import { orangeButtonContent, companyCardContent } from "../style/utils";
import TopImage from "../components/TopImage";
import ViewCompanyDocuments from "../components/ViewModals/ViewVisorModals/ViewCompanyDocuments";
import ViewCompanyDetails from "../components/ViewModals/ViewVisorModals/ViewCompanyDetails";

// const companiesMap = [
//   {
//     email: "alemdaginsaat@gmail.com",
//     id: "EaK8v4RKPhTAcJfOR03z",
//     managerEmail: "testweb2@gmail.com",
//     managerId: "hPAwNwjo1sYFJtq2RHMuzrgsOwl1",
//     name: "Alemdağ İnşaat",
//     personnels: [],
//     phone: "2123438437",
//     profileImage: null,
//   },
//   {
//     email: "meraminsaat@gmail.com",
//     id: "geCVa1603A4WHwclSkIo",
//     managerEmail: "fatihercakir@gmail.com",
//     managerId: "0xb8I3iRpmQIl5WwhkJ7acM8cgD2",
//     name: "Meram İnşaat",
//     phone: "5342424242",
//     role: "companyManager",
//   },
//   {
//     email: "akoğluinsaat@gmail.com",
//     id: "qneuzqsnc3ZW1jpjLFnE",
//     managerEmail: "sami@gmail.com",
//     managerId: "1pQB5kpwv9cst5XQ53E0DYa6zfP2",
//     name: "Akoğlu İnşaat",
//     personnels: [""],
//     phone: "1234564323",
//     profileImage: "URL",
//   },
//   {
//     email: "tatarogluinsaat@gmail.com",
//     id: "uWArwN7XNjfK2ZMmrgXx",
//     managerEmail: "testweb@gmail.com",
//     managerId: "vOQmVlKpslempbSdl0mLgQ4iUa12",
//     name: "Tataroğlu İnşaat",
//     personnels: [
//       "3wCHhzlKaTRi18RJ0YBW7sXwicX2",
//       "scxTf0QgauhW8MeuuA6Zue0iAru2",
//     ],
//     phone: "905452265859",
//     profileImage:
//       "https://firebasestorage.googleapis.com/v0/b/g04-bitirme.appspot.com/o/proifl.jpeg?alt=media&token=a61cd7bc-36f2-4e6c-93ce-112919433aa8",
//   },
// ];
export default function VisorHome() {
  const windowScreenWidth = useWindowSizeWidth();
  const [companiesData, setCompaniesData] = useState([]);
  const [visorCompanyData, setVisorCompanyData] = useState({});
  const [viewSelectedCompany, setViewSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(false);

  const [isCompanyDocumentsModalOpen, setIsCompanyDocumentsModalOpen] =
    useState(false);
  const [isCompanyDetailsModalOpen, setIsCompanyDetailsModalOpen] =
    useState(false);

  useEffect(() => {
    const fetchData = () => {
      getVisorCompanyByManagerId((visorCompany) => {
        setVisorCompanyData(visorCompany || []);
        setLoading(false);
      });

      localStorage.setItem("companyId", visorCompanyData.id);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = () => {
      getVisorCompanies((companies) => {
        setCompaniesData(companies || []);
        setLoading(false);
      });
    };

    fetchData();
  }, []);

  const handleButtonClick = (company, modalType) => {
    if (!viewSelectedCompany) {
      setViewSelectedCompany(viewSelectedCompany === company ? null : company);
      switch (modalType) {
        case "documents":
          handleOpenCompanyDocumentsModal(company);
          console.log(modalType);
          break;
        case "details":
          handleOpenCompanyDetailsModal(company);
          console.log(modalType);
          break;
        default:
          console.error(`Invalid modal type: ${modalType}`);
      }
    } else {
      setViewSelectedCompany(null);
    }
  };

  // view modals
  const handleOpenCompanyDocumentsModal = () => {
    setIsCompanyDocumentsModalOpen(true);
  };

  const handleOpenCompanyDetailsModal = () => {
    setIsCompanyDetailsModalOpen(true);
  };

  const handleCloseCompanyDocumentsModal = () => {
    setIsCompanyDocumentsModalOpen(false);
    setViewSelectedCompany(null);
  };

  const handleCloseCompanyDetailsModal = () => {
    setIsCompanyDetailsModalOpen(false);
    setViewSelectedCompany(null);
  };

  console.log(companiesData);

  return (
    <div>
      {/* top image content */}
      <TopImage
        imagePath={Background1}
        companyName={"İnşaat"}
        page={"Firmaları"}
      />
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "auto",
          minHeight: 50,
          borderRadius: "50px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      ></div>

      {/* companies card content */}
      <Stack
        sx={{
          mt: 3,
          p: "1%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "25px",
        }}
      >
        {loading ? (
          <CircularProgress size={50} />
        ) : companiesData && companiesData.length > 0 ? (
          companiesData.map((company, index) => (
            <Card
              key={index}
              sx={{
                ...companyCardContent,
                maxWidth: windowScreenWidth > 900 ? "420px" : "100%",
                backgroundColor: "rgba(255, 152, 67, 0.2)",
              }}
            >
              <CardContent>
                <Stack
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    justifyContent: "space-around",
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    {company.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Email: {company.email}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Yönetici Email: {company.managerEmail}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Telefon: {company.phone}
                  </Typography>
                </Stack>

                <Stack
                  sx={{
                    width: "100%",
                    pt: 2,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "20px",
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={() => handleButtonClick(company, "documents")}
                    sx={{
                      ...orangeButtonContent,
                      width: 110,
                      height: 30,
                      fontSize: "12px",
                    }}
                  >
                    Dökümanlar
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleButtonClick(company, "details")}
                    sx={{
                      ...orangeButtonContent,
                      bgcolor: "rgba(134, 167, 252, 0.9)",
                      width: 110,
                      height: 30,
                      fontSize: "12px",
                      "&:hover": {
                        bgcolor: "rgba(134, 167, 252, 0.7)",
                        color: "#ffffff",
                        boxShadow: "0px 0 10px rgba(52, 104, 192, 0.7)",
                      },
                    }}
                  >
                    Detaylar
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body1">
            Kayıtlı bir firma bulunmamaktadır.
          </Typography>
        )}
      </Stack>

      {isCompanyDocumentsModalOpen && (
        <ViewCompanyDocuments
          isOpen={isCompanyDocumentsModalOpen}
          onClose={handleCloseCompanyDocumentsModal}
          viewSelectedCompany={viewSelectedCompany}
        />
      )}

      {isCompanyDetailsModalOpen && (
        <ViewCompanyDetails
          isOpen={isCompanyDetailsModalOpen}
          onClose={handleCloseCompanyDetailsModal}
          viewSelectedCompany={viewSelectedCompany}
        />
      )}
    </div>
  );
}
