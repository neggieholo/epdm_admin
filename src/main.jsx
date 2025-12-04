import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css'
import './index2.css'
import MainAdminPage from './AdminComponents/MainAdminPage.jsx';
import AdminLogin from './AdminComponents/AdminLogin.jsx';
import AdminDashboard from './AdminComponents/AdminDashboard.jsx';
import RegisterProject from './AdminComponents/RegisterProject.jsx';
import ProjectUpdate from './AdminComponents/ProjectUpdate.jsx';
import FindProJect from './AdminComponents/FindProJect.jsx';
import DeleteProject from './AdminComponents/DeleteProject.jsx';
import AdminSignUp from './AdminComponents/AdminSignUp.jsx';
import AdminForgotPasword from './AdminComponents/AdminForgotPasword.jsx';
import AdminResetPassword from './AdminComponents/AdminResetPassword.jsx';
import AdminLogsCheck from './AdminComponents/AdminLogsCheck.jsx';
import SendEmails from './AdminComponents/SendEmails.jsx';
import InfoEditDashboard from './AdminComponents/InfoEditDashboard.jsx';
import EditAboutUs from './AdminComponents/EditAboutUs.jsx';
import PreviewPage from './AdminComponents/Preview.jsx';
import EditServices from './AdminComponents/EditServices.jsx';
import EditOurTeam from './AdminComponents/EditOurTeam.jsx';
import TermsEditor from './AdminComponents/TermsEditor.jsx';
import SocialLinksEditor from './AdminComponents/SocialLinksEditor.jsx';
import ContactEditor from './AdminComponents/ContactEditor.jsx';
import NewsContentCreator from './AdminComponents/NewsContentCreator.jsx';
import NewsList from './AdminComponents/NewsList.jsx';
import EditPreviewNews from './AdminComponents/NewsPreviewEdit.jsx';
import ProjectInterviewCreator from './AdminComponents/ProjectInterviewCreator.jsx';
import InterviewsList from './AdminComponents/InterviewsList.jsx';
import NewsLinksCreator from './AdminComponents/NewsLinksCreator.jsx';
import UsersInfo from './AdminComponents/UsersInfo.jsx';
import SendUserEmail from './AdminComponents/SendUserEmail.jsx';
import EditPartners from './AdminComponents/EditPartners.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainAdminPage />,
    children: [
      {
        index: true,
        element: <AdminLogin />
      },
      {
        path: "admin/register",
        element: <AdminSignUp />
      },
      {
        path: "admin/adminDashboard",
        element: <AdminDashboard />
      },
      {
        path: "admin/register_project",
        element: <RegisterProject />
      },
      {
        path: "admin/find_project",
        element: <FindProJect />
      },
      {
        path: "admin/update_project",
        element: <ProjectUpdate />
      },
      {
        path: "admin/delete_project",
        element: <DeleteProject />
      },
      {
        path: "admin/forgot_password",
        element: <AdminForgotPasword />
      },
      {
        path: "admin/reset_password/:token",
        element: <AdminResetPassword />
      },
      {
        path: "admin/logs",
        element: <AdminLogsCheck />
      },
      {
        path: "admin/send_email",
        element: <SendEmails />
      },
      {
        path: "admin/edit_info",
        element: <InfoEditDashboard />
      },
      {
        path: "admin/edit_aboutUs",
        element: <EditAboutUs />
      },
      {
        path: "admin/preview",
        element: <PreviewPage />
      },
      {
        path: "admin/edit_services",
        element: <EditServices />
      },
      {
        path: "admin/edit_ourTeam",
        element: <EditOurTeam />
      },
      {
        path: "admin/edit_terms",
        element: <TermsEditor />
      },
      {
        path: "admin/edit_socials",
        element: <SocialLinksEditor />
      },
      {
        path: "admin/edit_contact",
        element: <ContactEditor />
      },
      {
        path: "admin/set_news",
        element: <NewsContentCreator />
      },
      {
        path: "admin/view_news",
        element: <NewsList />
      },
      {
        path: "admin/view_interviews",
        element: <InterviewsList />
      },
      {
        path: "admin/set_interviews",
        element: <ProjectInterviewCreator />
      },
      {
        path: "admin/users_info",
        element: <UsersInfo />
      },
      {
        path: "admin/set_newsLinks",
        element: <NewsLinksCreator />
      },
      {
        path: "admin/edit_preview_news",
        element: <EditPreviewNews/>
      },
      {
        path: "admin/edit_partners",
        element: <EditPartners/>
      },
      {
        path: "admin/send_user_email",
        element: <SendUserEmail/>
      },
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <RouterProvider router={router} />
  </StrictMode>
)
