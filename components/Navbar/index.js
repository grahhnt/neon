import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  AppBar,
  Drawer,
  Toolbar,
  Divider,
  List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader,
  IconButton,
  Typography,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Button,
  TextField,
  Autocomplete,
  Box,
  Stack,
} from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import CodeIcon from '@mui/icons-material/Code';
import SourceIcon from '@mui/icons-material/Source';
import DataObjectIcon from '@mui/icons-material/DataObject';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import EditIcon from '@mui/icons-material/Edit';
import CollectionsIcon from '@mui/icons-material/Collections';
import MenuIcon from '@mui/icons-material/Menu';
import GitHubIcon from '@mui/icons-material/GitHub';

import { useSession } from 'next-auth/react';

const CollectionsModal = ({ open, onClose }) => {
  const [collections, setCollections] = useState([]);
  const [projects, setProjects] = useState([]);

  const [editingCollection, setEditingCollection] = useState({});
  const [showEditCollection, setShowEditCollection] = useState(false);
  const [editCollectionID, setEditCollectionID] = useState("");
  const [editCollectionName, setEditCollectionName] = useState("");
  const [editCollectionHeader, setEditCollectionHeader] = useState("");
  const [editProjects, setEditProjects] = useState([]);

  const handleOpenEditCollection = () => {
    setShowEditCollection(true);
  }
  const handleCloseEditCollection = () => {
    setEditingCollection({});
    setShowEditCollection(false);
  }
  const handleSaveEditCollection = () => {
    fetch("/api/collections", {
      method: editingCollection?._id ? "PUT" : "POST",
      body: JSON.stringify({
        _id: editCollectionID,
        name: editCollectionName,
        header: editCollectionHeader,
        projects: editProjects
      })
    }).then(a => a.json()).then(data => {
      if(data.success) {
        handleCloseEditCollection();
        update();
      } else {
        alert("Error: " + data.error);
      }
    });
  }

  const update = () => {
    fetch("/api/collections").then(a => a.json()).then(data => {
      if(data.success) {
        setCollections(data.collections);
      } else {
        console.error(data.error);
      }
    })
    fetch("/api/projects").then(a => a.json()).then(data => {
      if(data.success) {
        setProjects(data.projects);
      } else {
        console.error(data.error);
      }
    })
  }

  useEffect(() => {
    update();
  }, []);

  useEffect(() => {
    setEditCollectionID(editingCollection?._id || "");
    setEditCollectionName(editingCollection?.name || "");
    setEditCollectionHeader(editingCollection?.header || "");
    setEditProjects(editingCollection?.projects?.map(_id => projects.find(a => a._id === _id)) || []);
  }, [ showEditCollection, editingCollection ]);

  const handleDelete = (_id) => () => {
    const collection = collections.find(a => a._id === _id);
    if(collection.projects.length > 0) {
      if(!confirm("Are you sure you want to delete (" + collection._id + ") " + collection.name + "?\nThis collection has " + collection.projects.length + " project(s)")) {
        return;
      }
    }

    fetch("/api/collections", {
      method: "DELETE",
      body: JSON.stringify({
        id: _id
      })
    }).then(a => a.json()).then(data => {
      if(data.success) {
        update();
      } else {
        alert("Error: " + data.error);
      }
    })
  }

  const handleEdit = (_id) => () => {
    setEditingCollection(collections.find(a => a._id === _id));
    handleOpenEditCollection();
  }

  return <>
    <Dialog open={showEditCollection} onClose={handleCloseEditCollection}>
      <DialogTitle>Edit Collection</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="ID"
          type="text"
          fullWidth
          variant="standard"
          onChange={e => setEditCollectionID(e.target.value)}
          value={editCollectionID}
          disabled={!!editingCollection?._id}
        />
        <TextField
          margin="dense"
          label="Name"
          type="text"
          fullWidth
          variant="standard"
          onChange={e => setEditCollectionName(e.target.value)}
          value={editCollectionName}
        />
        <TextField
          margin="dense"
          label="Header"
          type="text"
          fullWidth
          variant="standard"
          onChange={e => setEditCollectionHeader(e.target.value)}
          value={editCollectionHeader}
        />
        {editingCollection._id !== "home" && (
          <Autocomplete
            multiple
            id="project-languages"
            margin="dense"
            options={projects}
            getOptionLabel={(option) => option?.name}
            defaultValue={[]}
            renderInput={(params) => (
              <TextField
              {...params}
              variant="standard"
              label="Projects"
              />
            )}
            value={editProjects}
            onChange={(e, val) => setEditProjects(val)}
          />
        )}
      </DialogContent>
      <DialogActions>
        {!!editingCollection?._id && editingCollection._id !== "home" && (
          <Button color="error" onClick={() => {
            handleDelete(editingCollection._id)();
            handleCloseEditCollection();
          }}>Delete</Button>
        )}
        <Button onClick={handleCloseEditCollection}>Cancel</Button>
        <Button onClick={handleSaveEditCollection}>Save</Button>
      </DialogActions>
    </Dialog>

    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Collections</DialogTitle>
      <DialogContent>
        <List sx={{ bgcolor: "background.paper" }} dense={true}>
          {collections.map(collection => (
            <ListItem key={collection._id} secondaryAction={
              <IconButton edge="end" onClick={handleEdit(collection._id)}>
                <EditIcon />
              </IconButton>
            }>
              <ListItemText primary={collection.name} secondary={collection._id + " - " + collection.projects.length + " projects"} />
            </ListItem>
          ))}
          <ListItem disablePadding>
            <ListItemButton onClick={handleOpenEditCollection}>
              <ListItemText primary="Create New" />
            </ListItemButton>
          </ListItem>
        </List>
      </DialogContent>
    </Dialog>
  </>
}

const TechnologyModal = ({ open, onClose }) => {
  const [technologies, setTechnologies] = useState([]);

  const [showNewTech, setShowNewTech] = useState(false);
  const [newTechID, setNewTechID] = useState("");
  const [newTechName, setNewTechName] = useState("");

  const handleOpenNewTech = () => {
    setNewTechID("");
    setNewTechName("");
    setShowNewTech(true);
  }
  const handleCloseNewTech = () => {
    setShowNewTech(false);
  }
  const handleSaveNewTech = () => {
    fetch("/api/technologies", {
      method: "POST",
      body: JSON.stringify({
        _id: newTechID,
        name: newTechName
      })
    }).then(a => a.json()).then(data => {
      if(data.success) {
        handleCloseNewTech();
        update();
      } else {
        alert("Error: " + data.error);
      }
    });
  }

  const update = () => {
    fetch("/api/technologies").then(a => a.json()).then(data => {
      if(data.success) {
        setTechnologies(data.technologies);
      } else {
        console.error(data.error);
      }
    })
  }

  useEffect(() => {
    update();
  }, []);

  const handleDelete = (_id) => () => {
    const tech = technologies.find(a => a._id === _id);
    if(tech.uses > 0) {
      if(!confirm("Are you sure you want to delete (" + tech._id + ") " + tech.name + "?\nThis language is used in " + tech.uses + " project(s)")) {
        return;
      }
    }

    fetch("/api/technologies", {
      method: "DELETE",
      body: JSON.stringify({
        id: _id
      })
    }).then(a => a.json()).then(data => {
      if(data.success) {
        update();
      } else {
        alert("Error: " + data.error);
      }
    })
  }

  return <>
    <Dialog open={showNewTech} onClose={handleCloseNewTech}>
      <DialogTitle>New Technology</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="ID"
          type="text"
          fullWidth
          variant="standard"
          onChange={e => setNewTechID(e.target.value)}
          value={newTechID}
        />
        <TextField
          margin="dense"
          label="Name"
          type="text"
          fullWidth
          variant="standard"
          onChange={e => setNewTechName(e.target.value)}
          value={newTechName}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseNewTech}>Cancel</Button>
        <Button onClick={handleSaveNewTech}>Save</Button>
      </DialogActions>
    </Dialog>

    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Technologies</DialogTitle>
      <DialogContent>
        <List sx={{ bgcolor: "background.paper" }} dense={true}>
          {technologies.map(tech => (
            <ListItem key={tech._id} secondaryAction={
              <IconButton edge="end" onClick={handleDelete(tech._id)}>
                <DeleteIcon />
              </IconButton>
            }>
              <ListItemText primary={tech.name} secondary={tech._id + " - " + tech.uses + " uses"} />
            </ListItem>
          ))}
          <ListItem disablePadding>
            <ListItemButton onClick={handleOpenNewTech}>
              <ListItemText primary="Create New" />
            </ListItemButton>
          </ListItem>
        </List>
      </DialogContent>
    </Dialog>
  </>
}

const LanguagesModal = ({ open, onClose }) => {
  const [languages, setLanguages] = useState([]);

  const [showNewLang, setShowNewLang] = useState(false);
  const [newLangID, setNewLangID] = useState("");
  const [newLangName, setNewLangName] = useState("");

  const handleOpenNewLang = () => {
    setNewLangID("");
    setNewLangName("");
    setShowNewLang(true);
  }
  const handleCloseNewLang = () => {
    setShowNewLang(false);
  }
  const handleSaveNewLang = () => {
    fetch("/api/languages", {
      method: "POST",
      body: JSON.stringify({
        _id: newLangID,
        name: newLangName
      })
    }).then(a => a.json()).then(data => {
      if(data.success) {
        handleCloseNewLang();
        update();
      } else {
        alert("Error: " + data.error);
      }
    });
  }

  const update = () => {
    fetch("/api/languages").then(a => a.json()).then(data => {
      if(data.success) {
        setLanguages(data.languages);
      } else {
        console.error(data.error);
      }
    })
  }

  useEffect(() => {
    update();
  }, []);

  const handleDelete = (_id) => () => {
    const lang = languages.find(a => a._id === _id);
    if(lang.uses > 0) {
      if(!confirm("Are you sure you want to delete (" + lang._id + ") " + lang.name + "?\nThis language is used in " + lang.uses + " project(s)")) {
        return;
      }
    }

    fetch("/api/languages", {
      method: "DELETE",
      body: JSON.stringify({
        id: _id
      })
    }).then(a => a.json()).then(data => {
      if(data.success) {
        update();
      } else {
        alert("Error: " + data.error);
      }
    })
  }

  return <>
    <Dialog open={showNewLang} onClose={handleCloseNewLang}>
      <DialogTitle>New Language</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="ID"
          type="text"
          fullWidth
          variant="standard"
          onChange={e => setNewLangID(e.target.value)}
          value={newLangID}
        />
        <TextField
          margin="dense"
          label="Name"
          type="text"
          fullWidth
          variant="standard"
          onChange={e => setNewLangName(e.target.value)}
          value={newLangName}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseNewLang}>Cancel</Button>
        <Button onClick={handleSaveNewLang}>Save</Button>
      </DialogActions>
    </Dialog>

    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Languages</DialogTitle>
      <DialogContent>
        <List sx={{ bgcolor: "background.paper" }} dense={true}>
          {languages.map(lang => (
            <ListItem key={lang._id} secondaryAction={
              <IconButton edge="end" onClick={handleDelete(lang._id)}>
                <DeleteIcon />
              </IconButton>
            }>
              <ListItemText primary={lang.name} secondary={lang._id + " - " + lang.uses + " uses"} />
            </ListItem>
          ))}
          <ListItem disablePadding>
            <ListItemButton onClick={handleOpenNewLang}>
              <ListItemText primary="Create New" />
            </ListItemButton>
          </ListItem>
        </List>
      </DialogContent>
    </Dialog>
  </>
}

export default function Navbar({ drawerWidth }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [showCollections, setShowCollections] = useState(false);
  const [showLangs, setShowLangs] = useState(false);
  const [showTech, setShowTech] = useState(false);

  const [collections, setCollections] = useState([]);
  const [container, setContainer] = useState();

  useEffect(() => {
    fetch("/api/collections").then(a => a.json()).then(data => {
      if(data.success) {
        setCollections(data.collections.map(collection => ({
          ...collection,
          path: "/" + (collection._id !== "home" ? collection._id : "")
        })));
      } else {
        console.error(data.error);
      }
    })

    // setContainer(() => window.document.body);
  }, []);

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  }

  const DrawerContent = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flexGrow: 1 }}>
        <Toolbar>
          <Typography variant="h4">{process.env.NEXT_PUBLIC_APP_NAME}</Typography>
        </Toolbar>
        <Divider />
        <List>
          <ListSubheader>
            Collections
          </ListSubheader>
          {collections.map(collection => (
            <ListItem disablePadding key={collection._id} selected={router.asPath === collection.path}>
              <ListItemButton href={collection.path}>
                <ListItemIcon>
                  <CollectionsIcon />
                </ListItemIcon>
                <ListItemText primary={collection.name} />
              </ListItemButton>
            </ListItem>
          ))}

          {status === "authenticated" && (
            <>
              <ListSubheader>
                Management
              </ListSubheader>
              <ListItem disablePadding>
                <ListItemButton onClick={() => setShowCollections(true)}>
                  <ListItemIcon>
                    <FolderCopyIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Collections"} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => setShowLangs(true)}>
                  <ListItemIcon>
                    <CodeIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Languages"} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => setShowTech(true)}>
                  <ListItemIcon>
                    <SourceIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Technology"} />
                </ListItemButton>
              </ListItem>
              {/* <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <DataObjectIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Source Code"} />
                </ListItemButton>
              </ListItem> */}
            </>
          )}
        </List>
      </div>
      <Box sx={{ p: 2 }}>
        <Box sx={{ color: "text.secondary" }}>
          <Stack spacing={1} direction="row" alignItems="center">
            <div dangerouslySetInnerHTML={{ __html: process.env.NEXT_PUBLIC_COPYRIGHT }}></div>
            <div>&bull;</div>
            <IconButton href="https://github.com/grahhnt/neon" size="small">
              <GitHubIcon />
            </IconButton>
          </Stack>
        </Box>
      </Box>
    </Box>
  )

  return (<>
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        display: { sm: 'none' }
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          {process.env.NEXT_PUBLIC_APP_NAME}
        </Typography>
      </Toolbar>
    </AppBar>
    <CollectionsModal open={showCollections} onClose={() => setShowCollections(false)} />
    <LanguagesModal open={showLangs} onClose={() => setShowLangs(false)} />
    <TechnologyModal open={showTech} onClose={() => setShowTech(false)} />
    <Drawer
      container={container}
      variant="temporary"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        display: { xs: 'block', sm: 'none' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
      }}
    >
      <DrawerContent />
    </Drawer>
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', sm: 'block' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
      }}
      open
    >
      <DrawerContent />
    </Drawer>
  </>);
}
