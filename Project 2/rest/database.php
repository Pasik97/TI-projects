<?php

class db {
  private $user = "6pasik" ;
  private $pass = "pass";
  private $host = "pascal.fis.agh.edu.pl";
  private $base = "6pasik";
  private $dataColl = "antykwariat";
	private $userColl = "uzytkownicy";
	private $sessionColl = "sesja";
	private $conn;
	private $dbase;
	private $dataCollection;
	private $userCollection;
	private $sessionCollection;
  private $dbh;

  function __construct()
  {
    $this->conn = new Mongo("mongodb://{$this->user}:{$this->pass}@{$this->host}/{$this->base}");
    $this->dbase = $this->conn->selectDB($this->base);
    $this->dataCollection = $this->dbase->selectCollection($this->dataColl);
    $this->userCollection = $this->dbase->selectCollection($this->userColl);
    $this->sessionCollection = $this->dbase->selectCollection($this->sessionColl);
  }

  public function getRatings() {
    $cursor = $this->dataCollection->find();
		$table = iterator_to_array($cursor);
		return $table ;
  }

  public function getAvgRatings() {
    $ret = $this->dataCollection->distinct('data');
    return $ret ;
  }

  public function addRating($array) {
    $query = array('ocena' => $array['ocena'], 'opinia' => $array['opinia'], 'data' => $array['data']);
		$cursor = $this->dataCollection->find($query);
    $ret = $this->dataCollection->insert($query) ;
		return $ret;
  }

  public function checkSession($array) {
    $doc =  $this->sessionCollection->findOne(array('sessionID' => $array['sessionID']));
		if($doc != NULL)
		{
			$start = $doc['start'];
			$date = DateTime::createFromFormat("Y-m-d H:i:s", $start);
			$now = new DateTime('now');
			$diff = $now->getTimestamp() - $date->getTimestamp();
			if( $diff > (30*60))
			{
				$this->sessionCollection->remove(array('sessionID' => $array['sessionID']));
				return false;
			}
		}
		else
			return false;
		return true;
	}

  public function login($array){
		$username = $array['login'];
		$password = $array['haslo'];
		$cursor =  $this->userCollection->find(array('uzytkownik' => $username, 'haslo' => $password));
		if($cursor->count() == 0)
			$ret = false;
		else
		{
			$sessionID = md5(uniqid($username, true));
			$start = date('Y-m-d H:i:s', time());
			$ret = $this->sessionCollection->insert(array('sessionID' => $sessionID, 'start' => $start));
		}
		return $sessionID;
	}

  public function logout($sessionid) {
    $doc =  $this->sessionCollection->findOne(array('sessionID' => $sessionid));
		if($doc != NULL)
		{
			$this->sessionCollection->remove(array('sessionID' => $sessionid));
		}
		else
			return false;
		return true;
  }

}


?>
