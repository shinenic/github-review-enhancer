import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import { isEmpty, intersection } from 'lodash'
import { PAGE_TYPE, REPO_URL } from 'constants'
import useStore from 'stores/setting'
import { startTokenGuide } from 'utils/tokenGuide'
import Link from '@material-ui/core/Link'
import GithubIcon from '../GithubIcon'

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3),
    position: 'relative',
  },
  typography: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(1),
    '&:nth-of-type(1)': {
      marginTop: theme.spacing(0),
    },
  },
  link: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    transition: 'opacity 0.1s',
    '&:hover': {
      opacity: 0.8,
    },
  },
}))

export default function SettingForm() {
  const classes = useStyles()

  return (
    <Paper variant="outlined" className={classes.paper}>
      <Link
        href={REPO_URL}
        target="_blank"
        rel="noopener noference"
        className={classes.link}
      >
        <GithubIcon size="30" />
      </Link>
      <VisibilityCheckBoxes classes={classes} />
      <FocusCheckBox classes={classes} />
      <TokenField classes={classes} />
    </Paper>
  )
}

const TokenField = ({ classes }) => {
  const dispatch = useStore((s) => s.dispatch)
  const token = useStore((s) => s.token)

  const handleInputChange = (event) => {
    dispatch({ type: 'UPDATE_TOKEN', payload: event.target.value })
  }

  const handleClear = () => {
    dispatch({ type: 'UPDATE_TOKEN', payload: '' })
  }

  const handleStart = () => {
    dispatch({ type: 'CLOSE_MODAL' })
    startTokenGuide()
  }

  return (
    <>
      <Typography variant="h6" className={classes.typography}>
        Personal access token (private & enterprise)
      </Typography>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={7}>
          <TextField
            id="TokenTextField"
            name="TokenTextField"
            label="Token"
            fullWidth
            value={token}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={5}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              marginLeft: 20,
            }}
          >
            <Button
              disabled={!isEmpty(token)}
              onClick={handleStart}
              color="primary"
              variant="contained"
            >
              Create
            </Button>
            <Button
              disabled={isEmpty(token)}
              onClick={handleClear}
              color="secondary"
              variant="outlined"
            >
              Clear
            </Button>
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

const FocusCheckBox = ({ classes }) => {
  const dispatch = useStore((s) => s.dispatch)
  const isFocusMode = useStore((s) => s.isFocusMode)

  const handleChange = () => {
    dispatch({ type: 'TOGGLE_FOCUS_MODE' })
  }

  return (
    <>
      <Typography variant="h6" className={classes.typography}>
        Options
      </Typography>
      <Grid container alignItems="center">
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="primary" name="Focus" value="yes" />}
            label="Focus on single file while code reviewing (experience)"
            checked={isFocusMode}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
    </>
  )
}

const VISIBLE_PAGE_TYPE_OPTIONS = [
  { text: 'Code', disabled: true, checked: true },
  { text: 'Pull requests', disabled: true, checked: true },
  { text: 'Issues', values: [PAGE_TYPE.ISSUES] },
  { text: 'Others (Discussions, Wiki, ...)', values: [PAGE_TYPE.OTHERS] },
]

export const VisibilityCheckBoxes = ({ classes }) => {
  const disablePageTypeList = useStore((s) => s.disablePageTypeList) ?? []
  const dispatch = useStore((s) => s.dispatch)

  return (
    <>
      <Typography variant="h6" className={classes.typography}>
        Show A-Tree on
      </Typography>
      <Grid container alignItems="center">
        {VISIBLE_PAGE_TYPE_OPTIONS.map(
          ({ text, disabled, checked, values }) => {
            const isChecked =
              checked || isEmpty(intersection(values, disablePageTypeList))

            const handleChange = () => {
              values.forEach((pageType) => {
                if (disablePageTypeList?.includes(pageType)) {
                  dispatch({
                    type: 'UPDATE_DISABLE_PAGE_TYPE_LIST',
                    payload: disablePageTypeList.filter(
                      (type) => type !== pageType
                    ),
                  })
                } else {
                  dispatch({
                    type: 'UPDATE_DISABLE_PAGE_TYPE_LIST',
                    payload: [...disablePageTypeList, pageType],
                  })
                }
              })
            }

            return (
              <Grid item xs={12}>
                <FormControlLabel
                  key={text}
                  disabled={disabled}
                  control={
                    <Checkbox
                      name={text}
                      color="primary"
                      checked={isChecked}
                      onChange={handleChange}
                    />
                  }
                  label={text}
                />
              </Grid>
            )
          }
        )}
      </Grid>
    </>
  )
}
