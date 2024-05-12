import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import MapHome from '../components/map/map_home/MapHome'
import { Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useWindowSizeWidth } from '../config/hooks';
import { getAuthUserInformation, getCompanyByManagerId, getCompanyIdByAuthUser, getCompanyProjects, getCompanyWorksites } from '../config/firebase';
import WorksitesTable from '../components/table/worksites_table/WorksitesTable';
import ProjectsTable from '../components/table/projects_table/ProjectsTable';
import {
  mainContent,
  tableContent,
  tableContentHeader,
  buttonContent,
} from "../style/utils";

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
