import { useCallback, useEffect, useRef, useReducer, useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import {
  buildUsedLetterMap,
  highlightText,
  generateHotkeyListener,
} from 'utils/fileSearch'
import { isEmpty } from 'lodash'
import { CustomModal } from 'components/shared/Modal'
import useUpdateEffect from 'hooks/useUpdateEffect'
import useTreeItemClick from 'hooks/tree/useTreeItemClick'
import useQueryTree from 'hooks/tree/useQueryTree'

import SearchBar from 'components/SearchBar'
import { initialState, reducer } from './reducer'
import * as Style from './style'

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.secondary,
    borderRadius: '12px',
    boxShadow: theme.shadows[5],
    padding: '8px 0',
    width: '650px',
    display: 'flex',
    flexDirection: 'column',
  },
}))

const FileSearchWrapper = ({ pageInfo, isOpen, onOpen, onClose }) => {
  const { data, isLoading, error } = useQueryTree(pageInfo, isOpen)
  const onItemClick = useTreeItemClick(pageInfo)

  return (
    <FileSearchModal
      files={data?.files || data?.tree || data}
      selectCallback={onItemClick}
      isLoading={isLoading}
      error={error}
      onOpen={onOpen}
      onClose={onClose}
      isOpen={isOpen}
    />
  )
}

/**
 * @TODO Handle loading & error status
 * @TODO Handle SPA from page Pull-Conversation to page Pull-Files
 * @FIXME Can't apply focus file via press `enter`
 */
const FileSearchModal = ({
  isLoading,
  selectCallback,
  files,
  error,
  onOpen,
  onClose,
  isOpen,
}) => {
  const [{ result = [], keyword = '', selectedIndex = 0, isOpened }, dispatch] =
    useReducer(reducer, {
      ...initialState,
      selectCallback,
    })

  const classes = useStyles()
  const inputRef = useRef(null)

  useEffect(() => {
    if (!isLoading && !isEmpty(files)) {
      dispatch({
        type: 'UPDATE_SOURCE_DATA',
        payload: {
          files: files?.filter(({ type }) => type !== 'tree') ?? [],
        },
      })
    } else {
      dispatch({ type: 'CLEAR_SOURCE_DATA' })
    }
  }, [isLoading, files])

  useEffect(() => {
    dispatch({ type: isOpen ? 'OPEN' : 'CLOSE' })
  }, [isOpen])

  useEffect(() => {
    dispatch({ type: 'UPDATE_SELECT_CALLBACK', payload: { selectCallback } })
  }, [selectCallback])

  /**
   * Auto focus input when modal opened
   */
  useEffect(() => {
    if (inputRef.current && isOpened) {
      inputRef.current.focus()
    }
  }, [isOpened])

  /**
   * Handle shortcuts
   */
  useEffect(() => {
    const unlisten = generateHotkeyListener(dispatch, isOpened)

    return () => unlisten()
  }, [isOpened])

  useUpdateEffect(() => {
    isOpened ? onOpen() : onClose()
  }, [isOpened])

  const handleInputChange = useCallback((e) => {
    e.preventDefault()
    dispatch({ type: 'UPDATE_KEYWORD', payload: { keyword: e.target.value } })
  }, [])

  const handleOptionClick = useCallback(
    (index) => () => {
      dispatch({ type: 'SELECT_INDEX', payload: { selectedIndex: index } })
    },
    []
  )
  const highlightMap = useMemo(() => buildUsedLetterMap(keyword), [keyword])

  if (error) return null

  return (
    <CustomModal
      isOpened={isOpened}
      onClose={() => {
        dispatch({ type: 'CLOSE' })
        if (onClose) onClose()
      }}
      overLayStyle={{ alignItems: 'start', paddingTop: '15vh' }}
    >
      <div className={classes.paper}>
        <SearchBar
          withBorder={false}
          showHints={false}
          placeholder="Enter keyword to search files..."
          inputRef={inputRef}
          value={keyword}
          withoutBorder
          onChange={handleInputChange}
        />
        {result.map((file, index) => {
          const paths = file.filename
            ? file.filename.split('/')
            : file.path.split('/')
          const path = paths.slice(0, -1).join('/')
          const fileName = paths.slice(-1).join()
          const isSelected = index === selectedIndex

          return (
            <Style.FileRow
              onClick={handleOptionClick(index)}
              key={paths.join('')}
              isSelected={isSelected}
            >
              <Style.FileName
                dangerouslySetInnerHTML={{
                  __html: highlightText(fileName, highlightMap),
                }}
              />
              <Style.FilePath
                dangerouslySetInnerHTML={{
                  __html: highlightText(path, highlightMap),
                }}
                tooltip={path}
              />
            </Style.FileRow>
          )
        })}
      </div>
    </CustomModal>
  )
}

export default FileSearchWrapper
