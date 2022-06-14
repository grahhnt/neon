import Head from 'next/head'
import Image from 'next/image'
import Router, { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useSession } from 'next-auth/react';

import MongoDB from '../lib/mongodb';
import {
  Project,
  Technology,
  Language,
  SourceCodeType,
  Collection
} from '../lib/models';

import {
  Typography,
  Box,
  Toolbar,
  FormControl, FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  List, ListItem, ListItemText, ListItemButton,
  Card, CardMedia, CardContent, CardActions, CardActionArea,
  Button,
  Grid,
  Container,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  TextField,
  Chip,
  Autocomplete,
  IconButton,
  Stepper, Step, StepLabel, StepContent,
  Stack,
  Switch,
} from '@mui/material';
import FilterIcon from '@mui/icons-material/FilterList';
import DeleteIcon from '@mui/icons-material/Delete';
import GitHubIcon from '@mui/icons-material/GitHub';
import PreviewIcon from '@mui/icons-material/Preview';

const timeframeString = tf => tf?.date.toLocaleDateString(undefined, tf.format);

const CreateProjectModal = ({ open, onClose, collection, Languages, Technologies, SourceCode, project }) => {
  const [id, setID] = useState("");
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState("");
  const [langs, setLangs] = useState([]);
  const [tech, setTech] = useState([]);
  const [demo, setDemo] = useState("");
  const [source, setSource] = useState("public");
  const [sourceLocation, setSourceLocation] = useState("");
  const [timeframe, setTimeframe] = useState([]);
  const [ongoing, setOngoing] = useState(false);
  const [pinned, setPinned] = useState(false);

  const [newTimelineOpen, setNewTimelineOpen] = useState(false);
  const [NTLDate, setNTLDate] = useState("");
  const [NTLText, setNTLText] = useState("");

  const handleOpenNewTimeline = () => {
    setNewTimelineOpen(true);
  }

  const reset = () => {
    setID(project?._id || "");
    setName(project?.name || "");
    setTagline(project?.tagline || "");
    setDesc(project?.description || "");
    setImage(project?.image || "");
    setLangs(project?.languages?.map(l => Languages.get(l)) || []);
    setTech(project?.technologies?.map(t => Technologies.get(t)) || []);
    setDemo(project?.demo || "");
    setSource(project?.sourceCode?.type || "private");
    setSourceLocation(project?.sourceCode?.location || "");
    setTimeframe(project?.timeframe?.map(t => ({ ...t, date: new Date(t.date) })) || []);
    setOngoing(project?.ongoing || false);
    setPinned(project?.pinned || false);
  }

  const addTimeframe = ({ date, text }) => {
    const tf = [...timeframe, {
      date,
      text,
      format: { month: "long", year: "numeric" }
    }];
    tf.sort((a, b) => a.date.getTime() - b.date.getTime());
    setTimeframe(tf);
  }

  const removeTimelineItem = (time) => {
    const tf = timeframe.filter(a => a.date.getTime() != time);
    setTimeframe(tf);
  }

  useEffect(() => {
    reset();
  }, [open])

  const handleSave = () => {
    fetch("/api/projects", {
      method: project?._id ? "PUT" : "POST",
      body: JSON.stringify({
        _id: id,
        name,
        tagline,
        description: desc,
        image,
        languages: langs,
        technologies: tech,
        demo,
        sourceCode: {
          type: source,
          location: sourceLocation
        },
        timeframe,
        ongoing,
        pinned
      })
    }).then(a => a.json()).then(data => {
      if(data.success) {
        Router.reload();
      } else {
        alert(data.error);
      }
    })
  }

  const handleDelete = () => {
    fetch("/api/projects", {
      method: "DELETE",
      body: JSON.stringify({ id })
    }).then(a => a.json()).then(data => {
      if(data.success) {
        Router.reload();
      } else {
        alert(data.error);
      }
    })
  }

  return <>
    <Dialog open={newTimelineOpen} onClose={() => setNewTimelineOpen(false)}>
      <DialogTitle>New Timeline Item</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Timeline Date"
          type="text"
          fullWidth
          variant="standard"
          onChange={e => setNTLDate(e.target.value)}
          value={NTLDate}
          helperText={new Date(NTLDate + " MST").toLocaleDateString(undefined, { month: "long", year: "numeric" })}
        />
        <TextField
          margin="dense"
          label="Timeline Text"
          type="text"
          fullWidth
          variant="standard"
          onChange={e => setNTLText(e.target.value)}
          value={NTLText}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setNewTimelineOpen(false)}>Cancel</Button>
        <Button onClick={() => {
          addTimeframe({ date: new Date(NTLDate + " MST"), text: NTLText });
          setNewTimelineOpen(false);
        }}>Save</Button>
      </DialogActions>
    </Dialog>

    <Dialog open={open} onClose={onClose} scroll="paper">
      <DialogTitle>Edit Project</DialogTitle>
      <DialogContent>
        <DialogContentText>
          A project to showcase
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="project-id"
          label="Project ID"
          type="text"
          fullWidth
          variant="standard"
          onChange={e => setID(e.target.value)}
          disabled={!!project?._id}
          value={id}
        />
        <TextField
          margin="dense"
          id="project-name"
          label="Project Name"
          type="text"
          fullWidth
          variant="standard"
          onChange={e => setName(e.target.value)}
          value={name}
        />
        <TextField
          margin="dense"
          id="project-tagline"
          label="Project Tagline"
          type="text"
          fullWidth
          variant="standard"
          onChange={e => setTagline(e.target.value)}
          value={tagline}
        />
        <TextField
          margin="dense"
          id="project-description"
          label="Project Description"
          type="text"
          fullWidth
          variant="standard"
          multiline
          onChange={e => setDesc(e.target.value)}
          value={desc}
        />
        <TextField
          margin="dense"
          id="project-image"
          label="Project Image"
          type="url"
          fullWidth
          variant="standard"
          onChange={e => setImage(e.target.value)}
          value={image}
        />
        <Autocomplete
          multiple
          id="project-languages"
          margin="dense"
          options={Languages}
          getOptionLabel={(option) => option?.name}
          defaultValue={[]}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Languages"
            />
          )}
          value={langs}
          onChange={(e, val) => setLangs(val)}
        />
        <Autocomplete
          multiple
          id="project-technologies"
          margin="dense"
          options={Technologies}
          getOptionLabel={(option) => option?.name}
          defaultValue={[]}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Technologies"
            />
          )}
          value={tech}
          onChange={(e, val) => setTech(val)}
        />
        <TextField
          margin="dense"
          id="project-demo"
          label="Project Demo"
          type="url"
          fullWidth
          variant="standard"
          onChange={e => setDemo(e.target.value)}
          value={demo}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Source Code</InputLabel>
          <Select
            label="Source Code"
            value={source}
            onChange={e => {
              setSource(e.target.value);
            }}
            renderValue={v => SourceCode.get(v).name}
            variant="standard"
          >
            {SourceCode.map(({ _id, name }) => (
              <MenuItem key={_id} value={_id} sx={{ px: 1 }}>
                <ListItemText primary={name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {source == "public" && (
          <TextField
            margin="dense"
            id="project-source-location"
            label="Project Source Location"
            type="url"
            fullWidth
            variant="standard"
            onChange={e => setSourceLocation(e.target.value)}
            value={sourceLocation}
          />
        )}
        <List dense={true} sx={{ bgcolor: 'background.paper', my: 1 }}>
          {timeframe.map(tf => (
            <ListItem key={tf.date.getTime()} secondaryAction={
              <IconButton edge="end" onClick={() => removeTimelineItem(tf.date.getTime())}>
                <DeleteIcon />
              </IconButton>
            }>
              <ListItemText primary={tf.text} secondary={tf.date.toLocaleDateString(undefined, tf.format)} />
            </ListItem>
          ))}
          <ListItemButton onClick={handleOpenNewTimeline}>
            <ListItemText primary="Add New Timeline Item" />
          </ListItemButton>
        </List>
        <FormControlLabel control={<Switch checked={ongoing} onChange={(e,v) => setOngoing(v)} />} label="Ongoing" />
        <FormControlLabel control={<Switch checked={pinned} onChange={(e,v) => setPinned(v)} />} label="Pinned" />
      </DialogContent>
      <DialogActions>
        {project?._id && <Button color="error" onClick={handleDelete}>Delete</Button>}
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  </>
}

const ProjectModal = ({ open, onClose, collection, Languages, Technologies, SourceCode, project, showEdit, editProject }) => {
  const SmallText = ({ children }) => <Typography variant="caption" sx={{ fontSize: 10 }}>{children}</Typography>

  const SourceButton = () => {
    return <Button
      variant="outlined"
      size="small"
      startIcon={<GitHubIcon />}
      disabled={project.sourceCode.type != "public"}
      href={project.sourceCode.location}
      target="_blank"
    >
      <Stack>
        Source
        <SmallText>{project.sourceCode.type}</SmallText>
      </Stack>
    </Button>;
  }

  const DemoButton = () => {
    return <Button
      variant="outlined"
      size="small"
      startIcon={<PreviewIcon />}
      href={project.demo}
      target="_blank"
    >
      <Stack>
        Demo
        <SmallText>{new URL(project.demo).host}</SmallText>
      </Stack>
    </Button>;
  }

  return <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth={true} scroll="paper">
    <Box sx={{
      width: "100%",
      height: "200px",
      backgroundImage: "url('" + (project.image || collection.header) + "')",
      backgroundPosition: "center",
      backgroundSize: "cover",
      filter: "blur(5px)",
      maskImage: "linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))"
    }} />
    <DialogTitle variant="h3">
      {project.name}
      <Typography variant="subtitle2" color="text.secondary">{project.tagline}</Typography>
    </DialogTitle>
    <DialogContent>
      <DialogContentText>
        <Stack spacing={1} direction="row">
          <SourceButton />
          {project.demo && <DemoButton />}
        </Stack>

        <ReactMarkdown>{project.description}</ReactMarkdown>

        <Stack spacing={2} sx={{
          "& h5": {
            marginBottom: 1
          }
        }}>
          <Box>
            <Typography variant="h5">Timeline</Typography>
            <Stepper orientation="vertical" activeStep={project.timeframe?.length}>
              {project.timeframe?.map(tf => (
                <Step key={tf.date.getTime()}>
                  <StepLabel optional={<Typography variant="caption">{timeframeString(tf)}</Typography>}>{tf.text}</StepLabel>
                  <StepContent>
                    {tf.details}
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Box>

          <Box>
            <Typography variant="h5">Languages Used</Typography>
            <Stack direction="row" spacing={1}>
              {project.languages?.map(lang => (
                <Chip key={lang} label={Languages.get(lang).name} />
              ))}
            </Stack>
          </Box>

          <Box>
            <Typography variant="h5">Technologies Used</Typography>
            <Stack direction="row" spacing={1}>
              {project.technologies?.map(lang => (
                <Chip key={lang} label={Technologies.get(lang).name} />
              ))}
            </Stack>
          </Box>

          {project.collections?.length > 0 && (
            <Box>
              <Typography variant="h5">Collections</Typography>
              <Stack direction="row" spacing={1}>
                {project.collections?.map(collection => (
                  <Button variant="outlined" key={collection._id} href={"/" + collection._id}>
                  {collection.name}
                  </Button>
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      {showEdit && <Button onClick={() => editProject(project)}>Edit</Button>}
      <Button onClick={onClose}>Close</Button>
    </DialogActions>
  </Dialog>
}

export default function Home({ collection, Projects, Languages, Technologies, SourceCode }) {
  const { data: session, status } = useSession();

  Projects = Projects.map(project => {
    project.timeframe = project.timeframe.map(tf => ({
      ...tf,
      date: new Date(tf.date)
    }))
    return project;
  });

  // contains all of these
  // eg. java & javascript & spigot api
  const [langs, setLangs] = useState([]);
  const [tech, setTech] = useState([]);
  // anything in this list
  // public || private
  const [source, setSource] = useState([ "public", "private", "proprietary"]);
  const [sort, setSort] = useState("newest");
  const [projects, setProjects] = useState(Projects);

  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [editProjectData, setEditProjectData] = useState({
    _id: "",
    name: "",
    description: "",
    image: "",
    languages: [],
    technologies: [],
    demo: "",
    source: "public",
    timeframe: []
  })

  const hideEditProjectModal = () => {
    setShowEditProjectModal(false);
  }

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showProjectData, setProjectData] = useState({});

  const handleHideProjectModal = () => {
    setShowProjectModal(false);
  }

  Languages.get = (_id) => Languages.find(a => a._id === _id);
  Technologies.get = (_id) => Technologies.find(a => a._id === _id);
  SourceCode.get = (_id) => SourceCode.find(a => a._id === _id);

  useEffect(() => {
    const filtered = Projects.filter(project => {
      var good = true;
      langs.forEach(l => {
        if(!project.languages.includes(l)) {
          good = false;
        }
      })
      tech.forEach(t => {
        if(!project.technologies.includes(t)) {
          good = false;
        }
      });
      if(!source.includes(project.sourceCode.type)) {
        good = false;
      }
      return good;
    });

    filtered.sort((a, b) => {
      if(!a.timeframe.length) return -1;
      if(!b.timeframe.length) return 1;

      return a.timeframe[a.timeframe.length - 1].date.getTime() - b.timeframe[b.timeframe.length - 1].date.getTime();
    });
    if(sort === "newest") {
      filtered.reverse();
    }
    filtered.sort((a, b) => {
      if(a.pinned && !b.pinned) return -1;
      if(!a.pinned && b.pinned) return 1;
      return 0;
    });

    setProjects(filtered);
  }, [langs, tech, source, sort]);

  const dropdownStyle = {
    m: 1,
    minWidth: 150
  }

  const dropdownText = (Set) => (selected) => selected.length == 1 ? Set.get(selected[0]).name : selected.length + " Items";

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Box sx={{
        width: "100%",
        height: "25%",
        backgroundImage: collection?.header ? "url('" + collection.header + "')" : "",
        backgroundPosition: "center",
        backgroundSize: "cover",
        filter: "blur(5px)",
        maskImage: "linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))"
      }} />
      <Toolbar sx={{ flexWrap: "wrap" }}>
        <FilterIcon />
        <FormControl sx={dropdownStyle} size="small">
          <InputLabel>Languages</InputLabel>
          <Select
            label="Language"
            multiple
            value={langs}
            onChange={e => {
              setLangs(e.target.value);
            }}
            renderValue={dropdownText(Languages)}
          >
            {Languages.map(({ _id, name }) => (
              <MenuItem key={_id} value={_id} sx={{ px: 1 }}>
                <Checkbox checked={langs.indexOf(_id) > -1} />
                <ListItemText primary={name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={dropdownStyle} size="small">
          <InputLabel>Technologies</InputLabel>
          <Select
            label="Technologies"
            multiple
            value={tech}
            onChange={e => {
              setTech(e.target.value);
            }}
            renderValue={dropdownText(Technologies)}
          >
            {Technologies.map(({ _id, name }) => (
              <MenuItem key={_id} value={_id} sx={{ px: 1 }}>
                <Checkbox checked={tech.indexOf(_id) > -1} />
                <ListItemText primary={name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={dropdownStyle} size="small">
          <InputLabel>Source Code</InputLabel>
          <Select
            label="Source Code"
            multiple
            value={source}
            onChange={e => {
              setSource(e.target.value);
            }}
            renderValue={dropdownText(SourceCode)}
          >
            {SourceCode.map(({ _id, name }) => (
              <MenuItem key={_id} value={_id} sx={{ px: 1 }}>
                <Checkbox checked={source.indexOf(_id) > -1} />
                <ListItemText primary={name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={dropdownStyle} size="small">
          <InputLabel>Sort By</InputLabel>
          <Select
            label="Sort By"
            value={sort}
            onChange={e => {
              setSort(e.target.value);
            }}
            renderValue={value => value == "newest" ? "Newest First" : "Oldest First"}
          >
            <MenuItem value="newest">Newest First</MenuItem>
            <MenuItem value="oldest">Oldest First</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ flexGrow: 1 }} />

        {status === "authenticated" && (
          <Button onClick={() => {
            setEditProjectData({});
            setShowEditProjectModal(true);
          }}>New Project</Button>
        )}
      </Toolbar>

      <Box sx={{ mx: 3, my: 1 }}>
        <Grid container spacing={2}>
          {projects.map(project => (
            <Grid item xxl={1} xl={2} md={6} xs={12} key={project._id}>
              <Card>
                <CardActionArea onClick={() => {
                  setProjectData(project);
                  setShowProjectModal(true);
                }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={project.image || collection.header}
                  />
                  <CardContent>
                    {(project.pinned || project.ongoing) && (
                      <Stack direction="row" spacing={1} mb={1}>
                        {project.pinned && <Chip label="pinned" color="warning" size="small" variant="outlined" />}
                        {project.ongoing && <Chip label="ongoing" color="info" size="small" variant="outlined" />}
                      </Stack>
                    )}

                    <Typography gutterBottom variant="h5" compoennt="div">{project.name}</Typography>
                    {project.timeframe.length > 0 && (
                      <Typography variant="subtitle2" color="text.secondary">
                        {timeframeString(project.timeframe[0])}
                        {project.timeframe.length > 1 ? " - " + timeframeString(project.timeframe[project.timeframe.length - 1]) : ""}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      {project.tagline}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <ProjectModal open={showProjectModal} onClose={handleHideProjectModal} project={showProjectData} showEdit={status === "authenticated"} editProject={project => {
        handleHideProjectModal();
        setEditProjectData(project);
        setShowEditProjectModal(true);
      }} collection={collection} Languages={Languages} Technologies={Technologies} SourceCode={SourceCode} />
      <CreateProjectModal open={showEditProjectModal} onClose={hideEditProjectModal} project={editProjectData} collection={collection} Languages={Languages} Technologies={Technologies} SourceCode={SourceCode} />
    </Box>
  )
}

export async function getServerSideProps({ query, res }) {
  const client = await MongoDB();

  const activeCollection = await Collection.findOne({ _id: query?.collection?.[0] || "home" }).populate("projects").lean();
  if(!activeCollection) {
    return {
      notFound: true
    }
  }

  const possibleProjects = activeCollection && activeCollection?._id !== "home" ? activeCollection.projects : await Project.find().lean();

  const Projects = possibleProjects;
  for(const project of Projects) {
    if(project.sourceCode?.type != "public") {
      delete project.sourceCode.location;
    }
    project.timeframe = project.timeframe.map(tf => ({
      ...tf,
      _id: null,
      date: tf.date.toString()
    }));
    project.collections = await Collection.find({ projects: project._id }).lean();
  }

  const Languages = await Language.find({}).lean();
  const Technologies = await Technology.find({}).lean();
  const SourceCode = await SourceCodeType.find({}).lean();

  return {
    props: {
      collection: activeCollection,
      Projects,
      Languages,
      Technologies,
      SourceCode
    }
  }
}
