// src/pages/Preview.jsx
import React, { useEffect, useState } from 'react';
import { Document, Page, Text, View, PDFViewer, StyleSheet } from '@react-pdf/renderer';
import { useLocation } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import Cookies from "js-cookie";


const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    color: '#2d2d73',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F3F4F6',
    padding: 8,
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 8,
  },
  tableCellHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
  },
  tableCell: {
    fontSize: 10,
    color: '#374151',
  },
});

const Preview = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [tasks, setTasks] = useState([])
  
  const FetchTasks = async (date) => {
    const { data } = await axios.get(import.meta.env.VITE_API_URL + `/api/projects/tasks?date=${date}`, { withCredentials: true });
    setTasks(data);
  }

  useEffect(() => {
    FetchTasks(date)
  }, [])


  const TaskPDF = () => (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.header}>Tasks Report for Today</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Tasks</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Done By</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Designation</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Project</Text>
            </View>
          </View>
          {tasks.length > 0 ? tasks.map((task, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{task.description}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{task.assignedTo.username}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{task.assignedTo.designation}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{task.project.name}</Text>
              </View>
            </View>
          )) : (
            <View style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>No tasks found for this date.</Text>
              </View>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="">
        <div className="flex justify-center items-center bg-gray-100">
          <PDFViewer style={{ width: '100%', height: '100vh' }}>
            <TaskPDF />
          </PDFViewer>
        </div>
      </div>
    </div>
  );
};

export default Preview;
