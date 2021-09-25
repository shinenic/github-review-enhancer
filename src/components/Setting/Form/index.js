import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import { isEmpty, intersection } from 'lodash'
import { PAGE_TYPE } from 'constants'
import { useSettingCtx } from 'components/Setting/Context/Provider'

const useStyles = makeStyles((theme) => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(3),
  },
  typography: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(1),
    '&:nth-of-type(1)': {
      marginTop: theme.spacing(0),
    },
  },
}))

export default function SettingForm() {
  const classes = useStyles()

  return (
    <main className={classes.layout}>
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper variant="outlined" className={classes.paper}>
          <VisibilityCheckBoxes classes={classes} />
          <FocusCheckBox classes={classes} />
          <TokenField classes={classes} />
        </Paper>
      </Container>
    </main>
  )
}

const TokenField = ({ classes }) => {
  const [{ token }, dispatch] = useSettingCtx()

  const handleInputChange = (event) => {
    dispatch({ type: 'UPDATE_TOKEN', payload: event.target.value })
  }

  const handleClear = () => {
    dispatch({ type: 'UPDATE_TOKEN', payload: '' })
  }

  return (
    <>
      <Typography variant="h6" className={classes.typography}>
        Personal access token (private & enterprise)
      </Typography>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={9}>
          <TextField
            id="TokenTextField"
            name="TokenTextField"
            label="Token"
            fullWidth
            value={token}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            disabled={isEmpty(token)}
            onClick={handleClear}
            color="secondary"
            variant="outlined"
          >
            Clear
          </Button>
        </Grid>
      </Grid>
    </>
  )
}

const FocusCheckBox = ({ classes }) => {
  const [{ isFocusMode }, dispatch] = useSettingCtx()

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
  const [{ disablePageTypeList = [] }, dispatch] = useSettingCtx()

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
