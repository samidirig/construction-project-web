import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import MapHome from '../components/map/map_home/MapHome'
import { Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useWindowSizeWidth } from '../config/hooks';
import { getAuthUserInformation, getCompanyByManagerId, getCompanyIdByAuthUser, getCompanyProjects, getCompanyWorksites } from '../config/firebase';
import WorksitesTable from '../components/table/worksites_table/WorksitesTable';
import ProjectsTable from '../components/table/projects_table/ProjectsTable';

const mainContent = {
  mt: 2,
  position: 'relative',
  width: '100%',
  display: 'flex',
  borderRadius: '20px',
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: '10px',
}

const tableContent = {
  position: 'relative',
  height: 400,
  display: 'flex',
  borderRadius: '20px',
  flexDirection: 'column',
  alignItems: 'center',
  boxShadow: "0px 0 10px rgba(52, 104, 192, 0.3)",
  '& > *': {
    width: '100%',
  },
}

const tableContentHeader = {
  width: '100%',
  height: '60px',
  position: 'absolute',
  top: 0,
  borderRadius: '20px 20px 0px 0px',
  px: '30px',
  mb: 2,
  backgroundColor: 'rgba(255, 152, 67, 0.7)',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
}

const buttonContent = {
  width: 120,
  height: 40,
  textAlign: "center",
  bgcolor: "rgba(134, 167, 252, 0.9)",
  color: "#fff",
  borderRadius: '50px',
  fontFamily: 'Arial, Helvatica, sans-serif',
  fontSize: '14px',
  cursor: 'pointer',
  textTransform: 'inherit',
  '&:hover': {
    bgcolor: "rgba(134, 167, 252, 0.7)",
    color: "#ffffff",
    boxShadow: "0px 0 10px rgba(52, 104, 192, 0.7)",
  }
}

export default function Home() {

  const navigate = useNavigate();
  const windowScreenWidth = useWindowSizeWidth();
  const [worksitesData, setWorksitesData] = useState([]);
  const [projectsData, setProjectsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const projects = await getCompanyProjects();
        setProjectsData(projects || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const worksites = await getCompanyWorksites();
        setWorksitesData(worksites || []);
      } catch (error) {
        console.error('Error fetching worksites:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleNavigateToWorksites = () => {
    navigate('/worksites');
  };

  const handleNavigateToProjects = () => {
    navigate('/projects');
  };

  return (
    <div>
      {/* map */}
      <Stack sx={{
        position: 'relative',
        width: '100%',
        height: windowScreenWidth > 1150 ? 400 : 500,
        display: 'flex',
        borderRadius: '20px',
        flexDirection: 'row',
        flexWrap: windowScreenWidth > 1150 ? 'nowrap' : 'wrap',
        alignItems: 'flex-start',
        gap: '10px',
      }}>
        {loading && worksitesData.length > 0 ? (
          <CircularProgress size={50} />
        ) : (
          <Stack sx={{
            position: 'relative',
            width: '100%',
            height: windowScreenWidth > 1150 ? 400 : 500,
            borderRadius: '20px',
          }}>
            <MapHome worksiteList={worksitesData} />
          </Stack>
        )}
      </Stack>

      {/* tables */}
      <Stack sx={{
        ...mainContent,
        height: windowScreenWidth > 1150 ? 400 : 500,
        flexWrap: windowScreenWidth > 1150 ? 'nowrap' : 'wrap',
      }}>

        {/* projects table */}
        <Stack sx={{
          ...tableContent,
          width: windowScreenWidth > 1150 ? '50%' : '100%', // Güncellendi
        }}>

          <Stack sx={tableContentHeader}>
            <Typography variant='h5' sx={{ color: '#fff' }}>
              Projeler
            </Typography>

            <Button
              onClick={handleNavigateToProjects}
              variant="contained"
              sx={buttonContent}
            >
              Hepsini Gör
            </Button>
          </Stack>

          {loading ? (
            <CircularProgress sx={{ mt: 20 }} size={50} />
          ) : (
            <Stack sx={{
              position: 'relative',
              alignItems: 'center',
              top: '65px',
            }}>
              {projectsData.length > 0 ? (
                <ProjectsTable projects={projectsData} />
              ) : (
                <Typography marginTop={10}>
                  Firmanıza ait mevcut Projeler bulunamadı.
                </Typography>
              )}
            </Stack>
          )}
        </Stack>


        {/* worksites table */}
        <Stack sx={{
          ...tableContent,
          width: windowScreenWidth > 1150 ? '50%' : '100%', // Güncellendi
        }}>

          <Stack sx={tableContentHeader}>
            <Typography variant='h5' sx={{ color: '#fff' }}>
              Şantiyeler
            </Typography>

            <Button
              onClick={handleNavigateToWorksites}
              variant="contained"
              sx={buttonContent}
            >
              Hepsini Gör
            </Button>
          </Stack>

          {loading ? (
            <CircularProgress sx={{ mt: 20 }} size={50} />
          ) : (
            <Stack sx={{
              position: 'relative',
              alignItems: 'center',
              top: '65px',
            }}>
              {worksitesData.length > 0 ? (
                <WorksitesTable worksites={worksitesData} />
              ) : (
                <Typography marginTop={10}>
                  Firmanıza ait mevcut şantiyeler bulunamadı.
                </Typography>
              )}
            </Stack>
          )}
        </Stack>

      </Stack>
    </div>
  )
}
